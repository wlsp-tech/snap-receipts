package wlsp.tech.backend.model.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReceiptUploadRequest {
  // Getter & Setter
  private String uuid;
  private String image;

}
