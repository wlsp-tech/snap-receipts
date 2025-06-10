package wlsp.tech.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CloudinaryServiceTest {

  private Uploader uploader;
  private CloudinaryService cloudinaryService;

  @BeforeEach
  void setUp() {
    Cloudinary cloudinary = mock(Cloudinary.class);
    uploader = mock(Uploader.class);
    when(cloudinary.uploader()).thenReturn(uploader);
    cloudinaryService = new CloudinaryService(cloudinary);
  }

  @Test
  void uploadFile_shouldReturnSecureUrl() throws IOException {
    MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test content".getBytes());
    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put("secure_url", "https://res.cloudinary.com/demo/image/upload/v123456/test.jpg");

    when(uploader.upload(any(byte[].class), anyMap())).thenReturn(resultMap);
    String result = cloudinaryService.uploadFile(file);
    assertEquals("https://res.cloudinary.com/demo/image/upload/v123456/test.jpg", result);
    verify(uploader).upload(any(byte[].class), anyMap());
  }

  @Test
  void deleteFile_shouldCallDestroy() throws IOException {
    cloudinaryService.deleteFile("test-id");

    verify(uploader).destroy(eq("test-id"), anyMap());
  }

  @Test
  void extractPublicIdFromUri_shouldExtractCorrectly() {
    String uri = "https://res.cloudinary.com/demo/image/upload/v123456/test-image.jpg";

    String publicId = cloudinaryService.extractPublicIdFromUri(uri);

    assertEquals("test-image", publicId);
  }

  @Test
  void extractPublicIdFromUri_shouldHandleNoExtension() {
    String uri = "https://res.cloudinary.com/demo/image/upload/v123456/testimage";
    String publicId = cloudinaryService.extractPublicIdFromUri(uri);
    assertEquals("testimage", publicId);
  }
}
