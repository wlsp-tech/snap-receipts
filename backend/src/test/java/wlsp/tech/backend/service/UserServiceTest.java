package wlsp.tech.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

  private UserRepository userRepository;
  private UserService userService;

  @BeforeEach
  void setUp() {
    userRepository = mock(UserRepository.class);
    userService = new UserService(userRepository);
  }

  @Test
  void addReceiptToUser_shouldAddReceiptIdAndSaveUpdatedUser() {
    // Setup
    String userId = "user123";
    String receiptId = "receipt456";
    User existingUser = new User(
            userId,
            "Alice",
            "alice@example.com",
            "hashedPassword",
            new ArrayList<>(List.of("oldReceiptId"))  // mutable list statt List.of()
    );

    when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // Call method
    User updatedUser = userService.addReceiptToUser(userId, receiptId);

    // Verify
    assertNotNull(updatedUser);
    assertEquals(userId, updatedUser.getId());
    assertTrue(updatedUser.getReceiptIds().contains("oldReceiptId"));
    assertTrue(updatedUser.getReceiptIds().contains(receiptId));
    assertEquals(existingUser.getNameOfUser(), updatedUser.getNameOfUser());
    assertEquals(existingUser.getEmail(), updatedUser.getEmail());
    assertEquals(existingUser.getPassword(), updatedUser.getPassword());

    verify(userRepository).findById(userId);
    verify(userRepository).save(updatedUser);
  }


  @Test
  void addReceiptToUser_whenUserNotFound_shouldThrowException() {
    String userId = "nonexistentUser";
    when(userRepository.findById(userId)).thenReturn(Optional.empty());

    assertThrows(RuntimeException.class, () -> userService.addReceiptToUser(userId, "someReceiptId"));
    verify(userRepository).findById(userId);
    verify(userRepository, never()).save(any());
  }
}
