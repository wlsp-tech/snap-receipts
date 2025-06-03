package wlsp.tech.backend.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SessionService {

  private final UserRepository userRepository;

  public Optional<User> getLoggedInUser(HttpSession session) {
    String userId = (String) session.getAttribute("userId");
    if (userId == null) return Optional.empty();
    return userRepository.findById(userId);
  }
}
