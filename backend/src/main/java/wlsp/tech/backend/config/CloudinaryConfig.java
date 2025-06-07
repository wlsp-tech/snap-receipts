package wlsp.tech.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "cloudinary.url")
public class CloudinaryConfig {

  @Value("${cloudinary.url}")
  private String cloudinaryUrl;

  @Bean
  public Cloudinary cloudinary() {
    return new Cloudinary(cloudinaryUrl);
  }
}
