package wlsp.tech.backend.model.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Document("users")
public class User {
  @Id
  private String id;
  private String nameOfUser;
  private String email;
  private String password;
  private List<String> receiptIds;

  public User(String id, String nameOfUser, String email, String password, List<String> receiptIds) {
    this.id = id;
    this.nameOfUser = nameOfUser;
    this.email = email;
    this.password = password;
    this.receiptIds = receiptIds;
  }

  public void addReceiptId(String receiptId) {
    if (receiptIds == null) {
      receiptIds = new ArrayList<>();
    }
    if (!receiptIds.contains(receiptId)) {
      receiptIds.add(receiptId);
    }
  }

  public void removeReceiptId(String receiptId) {
    if (receiptIds != null) {
      receiptIds.remove(receiptId);
    }
  }
}
