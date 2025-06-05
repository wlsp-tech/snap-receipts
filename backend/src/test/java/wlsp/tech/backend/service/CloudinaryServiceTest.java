package wlsp.tech.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
  void testUploadFileReturnsSecureUrl() throws IOException {
    // Arrange
    MockMultipartFile mockFile = new MockMultipartFile(
            "file", "test.jpg", "image/jpeg", "dummy data".getBytes());

    Map<String, Object> mockUploadResult = new HashMap<>();
    mockUploadResult.put("secure_url", "https://res.cloudinary.com/demo/image/upload/v1234/test.jpg");

    when(uploader.upload(any(byte[].class), anyMap())).thenReturn(mockUploadResult);

    // Act
    String result = cloudinaryService.upLoadFile(mockFile);

    // Assert
    assertEquals("https://res.cloudinary.com/demo/image/upload/v1234/test.jpg", result);
    verify(uploader, times(1)).upload(any(byte[].class), anyMap());
  }
}
