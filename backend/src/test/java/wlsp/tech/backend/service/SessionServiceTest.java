package wlsp.tech.backend.service;

import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.repository.UserRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SessionServiceTest {

  private UserRepository userRepository;
  private SessionService sessionService;
  private HttpSession session;

  @BeforeEach
  void setUp() {
    userRepository = mock(UserRepository.class);
    sessionService = new SessionService(userRepository);
    session = mock(HttpSession.class);
  }

  @Test
  void getLoggedInUser_whenUserIdInSession_returnsUser() {
    String userId = "user-123";
    User mockUser = new User(userId, "Alice", "alice@example.com", "hashed", List.of(), new Date());

    when(session.getAttribute("userId")).thenReturn(userId);
    when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

    Optional<User> result = sessionService.getLoggedInUser(session);

    assertTrue(result.isPresent());
    assertEquals(mockUser, result.get());

    verify(session).getAttribute("userId");
    verify(userRepository).findById(userId);
  }

  @Test
  void getLoggedInUser_whenNoUserIdInSession_returnsEmpty() {
    when(session.getAttribute("userId")).thenReturn(null);

    Optional<User> result = sessionService.getLoggedInUser(session);

    assertTrue(result.isEmpty());
    verify(session).getAttribute("userId");
    verify(userRepository, never()).findById(anyString());
  }

  @Test
  void getLoggedInUser_whenUserIdNotFound_returnsEmpty() {
    String userId = "missing-user";

    when(session.getAttribute("userId")).thenReturn(userId);
    when(userRepository.findById(userId)).thenReturn(Optional.empty());

    Optional<User> result = sessionService.getLoggedInUser(session);

    assertTrue(result.isEmpty());
    verify(session).getAttribute("userId");
    verify(userRepository).findById(userId);
  }
}
