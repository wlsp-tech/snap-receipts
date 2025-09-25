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

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;


  @Test
  void signUp_withValidData_returnsUserDto() throws Exception {
    RegisterRequest req = new RegisterRequest("John Doe", "john@example.com", "password123", new Date());
    String json = objectMapper.writeValueAsString(req);

    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nameOfUser").value("John Doe"))
            .andExpect(jsonPath("$.email").value("john@example.com"))
            .andExpect(jsonPath("$.receiptIds").isArray());
  }

  @Test
  void signUp_withEmptyName_returnsBadRequest() throws Exception {
    RegisterRequest req = new RegisterRequest("", "emptyname@example.com", "pwd", new Date());
    String json = objectMapper.writeValueAsString(req);

    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
            .andExpect(status().isBadRequest());
  }

  @Test
  void signUp_withExistingEmail_returnsConflict() throws Exception {
    RegisterRequest req = new RegisterRequest("Alice", "alice@example.com", "pwd", new Date());
    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk());

    RegisterRequest req2 = new RegisterRequest("Alice2", "alice@example.com", "pwd2", new Date());
    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(req2)))
            .andExpect(status().isConflict());
  }

  @Test
  void login_withValidCredentials_returnsUserDtoAndSession() throws Exception {
    RegisterRequest reg = new RegisterRequest("Bob", "bob@example.com", "secret", new Date());
    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(reg)))
            .andExpect(status().isOk());

    LoginRequest loginReq = new LoginRequest("bob@example.com", "secret");
    String loginJson = objectMapper.writeValueAsString(loginReq);

    mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("bob@example.com"))
            .andExpect(jsonPath("$.nameOfUser").value("Bob"));
  }

  @Test
  void login_withWrongPassword_returnsUnauthorized() throws Exception {
    RegisterRequest reg = new RegisterRequest("Carol", "carol@example.com", "rightpwd", new Date());
    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(reg)))
            .andExpect(status().isOk());

    LoginRequest loginWrongPwd = new LoginRequest("carol@example.com", "wrongpwd");

    mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginWrongPwd)))
            .andExpect(status().isUnauthorized());
  }

  @Test
  void getCurrentUser_withSession_returnsUserDto() throws Exception {
    RegisterRequest reg = new RegisterRequest("David", "david@example.com", "mypwd", new Date());
    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(reg)))
            .andExpect(status().isOk());

    LoginRequest loginReq = new LoginRequest("david@example.com", "mypwd");
    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginReq)))
            .andExpect(status().isOk())
            .andReturn();

    MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

    assert session != null;
    mockMvc.perform(get("/api/auth/me").session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("david@example.com"))
            .andExpect(jsonPath("$.nameOfUser").value("David"));
  }

  @Test
  void getCurrentUser_withoutSession_returnsUnauthorized() throws Exception {
    mockMvc.perform(get("/api/auth/me"))
            .andExpect(status().isUnauthorized());
  }

  @Test
  void logout_withSession_returnsOk() throws Exception {
    RegisterRequest reg = new RegisterRequest("Eva", "eva@example.com", "pwd", new Date());
    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(reg)))
            .andExpect(status().isOk());

    LoginRequest loginReq = new LoginRequest("eva@example.com", "pwd");
    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginReq)))
            .andExpect(status().isOk())
            .andReturn();

    MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

    assert session != null;
    mockMvc.perform(get("/api/auth/logout").session(session))
            .andExpect(status().isOk());
  }

  @Test
  void tokenLogin_withValidToken_returnsUserDtoAndSession() throws Exception {
    RegisterRequest register = new RegisterRequest("Frank", "frank@example.com", "pw123", new Date());
    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(register)))
            .andExpect(status().isOk());

    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(new LoginRequest("frank@example.com", "pw123"))))
            .andReturn();

    MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);

    assert session != null;
    MvcResult tokenResult = mockMvc.perform(post("/api/snap-receipts/token/generate-upload-token")
                    .session(session))
            .andExpect(status().isOk())
            .andReturn();

    String token = tokenResult.getResponse().getContentAsString();

    String tokenLoginJson = """
        {
          "token": "%s"
        }
        """.formatted(token);

    mockMvc.perform(post("/api/auth/token-login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(tokenLoginJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("frank@example.com"))
            .andExpect(jsonPath("$.nameOfUser").value("Frank"));
  }

  @Test
  void tokenLogin_withInvalidToken_returnsUnauthorized() throws Exception {
    String tokenLoginJson = """
        {
          "token": "nonexistent-token"
        }
        """;

    mockMvc.perform(post("/api/auth/token-login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(tokenLoginJson))
            .andExpect(status().isUnauthorized());
  }

}
