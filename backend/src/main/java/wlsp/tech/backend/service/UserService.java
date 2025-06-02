package wlsp.tech.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public User addReceiptToUser(String userId, String receiptId) {
    User user = userRepository.findById(userId).orElseThrow();

    ArrayList<String> receiptIds = new ArrayList<>(user.receiptIds() == null ? List.of() : user.receiptIds());
    receiptIds.add(receiptId);

    User updatedUser = new User(
            user.id(),
            user.nameOfUser(),
            user.email(),
            user.password(),
            receiptIds
    );

    return userRepository.save(updatedUser);
  }
}
