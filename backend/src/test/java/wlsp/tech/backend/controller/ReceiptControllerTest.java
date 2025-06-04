package wlsp.tech.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import wlsp.tech.backend.model.dto.LoginRequest;
import wlsp.tech.backend.model.dto.RegisterRequest;
import wlsp.tech.backend.model.dto.UserDto;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.service.*;

import java.time.Instant;


import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReceiptControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private ReceiptService receiptService;

  @Autowired
  private IdService idService;

  @Test
  void shouldGetReceipts_withLoggedInUser_returnsReceipts() throws Exception {

    String registerJson = objectMapper.writeValueAsString(new RegisterRequest(
            "Test User",
            "test-user@example.com",
            "securepassword"
    ));

    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(registerJson))
            .andExpect(status().isOk());

    String loginJson = objectMapper.writeValueAsString(new LoginRequest(
            "test-user@example.com",
            "securepassword"
    ));

    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginJson))
            .andExpect(status().isOk())
            .andReturn();

    MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

    assert session != null;
    MvcResult meResult = mockMvc.perform(get("/api/auth/me").session(session))
            .andExpect(status().isOk())
            .andReturn();

    String responseJson = meResult.getResponse().getContentAsString();
    UserDto userDto = objectMapper.readValue(responseJson, UserDto.class);

    Receipt receipt = new Receipt(
            idService.generateId(),
            userDto.id(),
            "https://example.com/image.jpg",
            Instant.now()
    );
    receiptService.saveReceipt(receipt);

    mockMvc.perform(get("/api/snap-receipts/receipts").session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].imageUri").value("https://example.com/image.jpg"));
  }

  @Test
  void shouldGenerateAndUseUploadToken() throws Exception {
    // Register user
    String registerJson = objectMapper.writeValueAsString(new RegisterRequest(
            "Token User",
            "token-user@example.com",
            "securepassword"
    ));

    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(registerJson))
            .andExpect(status().isOk());

    // Login
    String loginJson = objectMapper.writeValueAsString(new LoginRequest(
            "token-user@example.com",
            "securepassword"
    ));

    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginJson))
            .andExpect(status().isOk())
            .andReturn();

    MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

    // Get Upload Token
    assert session != null;
    MvcResult tokenResult = mockMvc.perform(post("/api/snap-receipts/token/generate-upload-token")
                    .session(session))
            .andExpect(status().isOk())
            .andReturn();

    String token = tokenResult.getResponse().getContentAsString().replace("\"", "");

    // Upload Receipt via Token
    String uploadJson = """
            {
                "token": "%s",
                "imageUri": "https://example.com/uploaded.jpg"
            }
            """.formatted(token);

    mockMvc.perform(post("/api/snap-receipts/token/upload-by-token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(uploadJson)
                    .session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.imageUri").value("https://example.com/uploaded.jpg"));

    // Verify receipt is stored
    mockMvc.perform(get("/api/snap-receipts/receipts").session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].imageUri").value("https://example.com/uploaded.jpg"));
  }


}