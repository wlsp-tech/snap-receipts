package wlsp.tech.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import wlsp.tech.backend.model.dto.LoginRequest;
import wlsp.tech.backend.model.dto.RegisterRequest;
import wlsp.tech.backend.model.dto.UserDto;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.model.token.UploadToken;
import wlsp.tech.backend.repository.ReceiptRepository;
import wlsp.tech.backend.repository.UploadTokenRepository;
import wlsp.tech.backend.repository.UserRepository;
import wlsp.tech.backend.service.CloudinaryService;
import wlsp.tech.backend.service.IdService;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ReceiptControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private ReceiptRepository receiptRepository;

  @Autowired
  private UploadTokenRepository uploadTokenRepository;

  @Mock
  private CloudinaryService cloudinaryService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private IdService idService;

  @TestConfiguration
  static class TestConfig {
    @Primary
    @Bean(name = "mockCloudinary")
    public Cloudinary cloudinary() {
      Cloudinary mock = mock(Cloudinary.class);
      Uploader uploader = mock(Uploader.class);

      try {
        when(mock.uploader()).thenReturn(uploader);
        when(uploader.upload(any(byte[].class), anyMap()))
                .thenReturn(Map.of("secure_url", "https://cloudinary.com/mock-image.jpg"));
      } catch (IOException e) {
        throw new RuntimeException(e);
      }

      return mock;
    }
  }

  @BeforeEach
  void cleanUp() {
    receiptRepository.deleteAll();
    uploadTokenRepository.deleteAll();
    userRepository.deleteAll();
  }

  @Test
  void shouldGetReceipts_withLoggedInUser_returnsReceipts() throws Exception {
    String email = "test-user@example.com";
    registerUser("Test User", email);

    MockHttpSession session = loginUser(email);

    String userId = getUserIdFromSession(session);

    Receipt receipt = createReceipt(userId);
    receiptRepository.save(receipt);

    mockMvc.perform(get("/api/snap-receipts/receipts").session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].imageUri").value("https://example.com/image.jpg"));
  }

  @Test
  void shouldGenerateAndUseUploadToken() throws Exception {
    String email = "token-user@example.com";
    registerUser("Token User", email);

    MockHttpSession session = loginUser(email);

    String token = generateUploadToken(session);

    MockMultipartFile file = new MockMultipartFile(
            "file",
            "test.jpg",
            "image/jpeg",
            "test image content".getBytes()
    );

    mockMvc.perform(multipart("/api/snap-receipts/token/upload-by-token")
                    .file(file)
                    .param("token", token)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.imageUri").isNotEmpty());

    assertThat(uploadTokenRepository.findById(token)).isEmpty();
  }

  @Test
  void shouldRejectUploadWithInvalidToken() throws Exception {
    MockMultipartFile file = new MockMultipartFile(
            "file",
            "test.jpg",
            "image/jpeg",
            "test image content".getBytes()
    );

    mockMvc.perform(multipart("/api/snap-receipts/token/upload-by-token")
                    .file(file)
                    .param("token", "invalid-token"))
            .andExpect(status().isUnauthorized());
  }

  @Test
  void shouldRejectUploadWithExpiredToken() throws Exception {
    String email = "expired-token@example.com";
    registerUser("Expired Token User", email);

    MockHttpSession session = loginUser(email);

    String userId = getUserIdFromSession(session);

    UploadToken expiredToken = new UploadToken(
            idService.generateId(),
            userId,
            Instant.now().minusSeconds(7200)
    );
    uploadTokenRepository.save(expiredToken);

    MockMultipartFile file = new MockMultipartFile(
            "file",
            "test.jpg",
            "image/jpeg",
            "test image content".getBytes()
    );

    mockMvc.perform(multipart("/api/snap-receipts/token/upload-by-token")
                    .file(file)
                    .param("token", expiredToken.id()))
            .andExpect(status().isUnauthorized());

    assertThat(uploadTokenRepository.findById(expiredToken.id())).isEmpty();
  }


  private void registerUser(String name, String email) throws Exception {
    mockMvc.perform(post("/api/auth/sign-up")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(
                            new RegisterRequest(name, email, "securepassword"))))
            .andExpect(status().isOk());
  }

  private MockHttpSession loginUser(String email) throws Exception {
    MvcResult result = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(
                            new LoginRequest(email, "securepassword"))))
            .andExpect(status().isOk())
            .andReturn();

    return (MockHttpSession) result.getRequest().getSession(false);
  }

  private String getUserIdFromSession(MockHttpSession session) throws Exception {
    MvcResult result = mockMvc.perform(get("/api/auth/me").session(session))
            .andExpect(status().isOk())
            .andReturn();

    UserDto userDto = objectMapper.readValue(result.getResponse().getContentAsString(), UserDto.class);
    return userDto.id();
  }

  private String generateUploadToken(MockHttpSession session) throws Exception {
    MvcResult result = mockMvc.perform(post("/api/snap-receipts/token/generate-upload-token")
                    .session(session))
            .andExpect(status().isOk())
            .andReturn();

    return result.getResponse().getContentAsString().replace("\"", "");
  }

  private Receipt createReceipt(String userId) {
    return new Receipt(
            idService.generateId(),
            userId,
            "https://example.com/image.jpg",
            Instant.now()
    );
  }

  @Test
  void deleteReceipt_withoutSession_returnsUnauthorized() throws Exception {

    Receipt receipt = new Receipt(idService.generateId(), "someUserId", "https://example.com/receipt.jpg", Instant.now());
    receiptRepository.save(receipt);

    mockMvc.perform(delete("/api/snap-receipts/{id}", receipt.id()))
            .andExpect(status().isUnauthorized());

    assertThat(receiptRepository.findById(receipt.id())).isPresent();
  }

  @Test
  void shouldGetReceiptById_withValidId_returnsReceipt() throws Exception {
    String email = "get-receipt@example.com";
    registerUser("Get Receipt User", email);
    MockHttpSession session = loginUser(email);
    String userId = getUserIdFromSession(session);

    Receipt receipt = new Receipt(idService.generateId(), userId, "https://example.com/image.jpg", Instant.now());
    receiptRepository.save(receipt);

    mockMvc.perform(get("/api/snap-receipts/{id}", receipt.id()).session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(receipt.id()))
            .andExpect(jsonPath("$.imageUri").value("https://example.com/image.jpg"));
  }

  @Test
  void shouldGetReceiptById_withoutSession_returnsUnauthorized() throws Exception {
    Receipt receipt = new Receipt(idService.generateId(), "someUserId", "https://example.com/receipt.jpg", Instant.now());
    receiptRepository.save(receipt);

    mockMvc.perform(get("/api/snap-receipts/{id}", receipt.id()))
            .andExpect(status().isUnauthorized());
  }

}
