package wlsp.tech.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public User addReceiptToUser(String userId, String receiptId) {
    User user = userRepository.findById(userId).orElseThrow();
    user.addReceiptId(receiptId);
    return userRepository.save(user);
  }

  public void removeReceiptFromUser(String userId, String receiptId) {
    User user = userRepository.findById(userId).orElseThrow();
    user.removeReceiptId(receiptId);
    userRepository.save(user);
  }
}
