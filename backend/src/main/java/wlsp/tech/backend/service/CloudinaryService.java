package wlsp.tech.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

  private final Cloudinary cloudinary;

  @SuppressWarnings("unchecked")
  public String uploadFile(MultipartFile file) throws IOException {
    Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap("resource_type", "auto"));
    return uploadResult.get("secure_url").toString();
  }
}
