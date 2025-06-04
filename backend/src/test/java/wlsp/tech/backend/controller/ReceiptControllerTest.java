package wlsp.tech.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
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
import wlsp.tech.backend.model.token.UploadToken;
import wlsp.tech.backend.repository.UploadTokenRepository;
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

  @Autowired
  private UploadTokenRepository uploadTokenRepository;

  @Autowired
  private UserService userService;

  @Autowired
  private UploadTokenService uploadTokenService;

  @BeforeEach
  void cleanUp() {
    // Optional: Clean tokens and receipts before each test if needed
    uploadTokenRepository.deleteAll();
  }

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
    // User Registrierung
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
    assert session != null;

    MvcResult tokenResult = mockMvc.perform(post("/api/snap-receipts/token/generate-upload-token")
                    .session(session))
            .andExpect(status().isOk())
            .andReturn();

    String token = tokenResult.getResponse().getContentAsString().replace("\"", "");

    String uploadJson = """
            {
                "token": "%s",
                "imageUri": "https://example.com/uploaded.jpg"
            }
            """.formatted(token);

    // Receipt hochladen via Token
    mockMvc.perform(post("/api/snap-receipts/token/upload-by-token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(uploadJson)
                    .session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.imageUri").value("https://example.com/uploaded.jpg"));


    mockMvc.perform(get("/api/snap-receipts/receipts").session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].imageUri").value("https://example.com/uploaded.jpg"));

    // Optional: Check if token is invalidated (deleted)
    boolean tokenExists = uploadTokenRepository.findById(token).isPresent();
    assert !tokenExists : "Token should be invalidated (deleted) after upload";
  }


  @Test
  void shouldRejectUploadWithInvalidToken() throws Exception {
    String invalidToken = "non-existent-token-id";

    String uploadJson = """
            {
                "token": "%s",
                "imageUri": "https://example.com/fake.jpg"
            }
            """.formatted(invalidToken);

    mockMvc.perform(post("/api/snap-receipts/token/upload-by-token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(uploadJson))
            .andExpect(status().isUnauthorized());
  }

  @Test
  void shouldRejectUploadWithExpiredToken() throws Exception {

    String email = "expired-token@example.com";
    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(
                            new RegisterRequest("Expired Token User", email, "password"))))
            .andExpect(status().isOk());

    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(new LoginRequest(email, "password"))))
            .andExpect(status().isOk())
            .andReturn();

    MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
    assert session != null;

    MvcResult meResult = mockMvc.perform(get("/api/auth/me").session(session))
            .andExpect(status().isOk())
            .andReturn();

    UserDto userDto = objectMapper.readValue(meResult.getResponse().getContentAsString(), UserDto.class);

    UploadToken expiredToken = new UploadToken(
            idService.generateId(),
            userDto.id(),
            Instant.now().minusSeconds(7200)
    );
    uploadTokenRepository.save(expiredToken);

    String uploadJson = """
          {
              "token": "%s",
              "imageUri": "https://example.com/expired.jpg"
          }
          """.formatted(expiredToken.id());

    mockMvc.perform(post("/api/snap-receipts/token/upload-by-token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(uploadJson))
            .andExpect(status().isUnauthorized());

    boolean tokenExists = uploadTokenRepository.findById(expiredToken.id()).isPresent();
    assert !tokenExists : "Expired token should be invalidated (deleted)";
  }
}
