package wlsp.tech.backend.model.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReceiptUploadRequest {
  private String token;
  private String imageUri;
}
