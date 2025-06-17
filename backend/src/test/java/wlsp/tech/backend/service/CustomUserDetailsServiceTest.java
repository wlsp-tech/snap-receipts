package wlsp.tech.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.repository.UserRepository;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomUserDetailsServiceTest {

  private UserRepository userRepository;
  private CustomUserDetailsService customUserDetailsService;

  @BeforeEach
  void setUp() {
    userRepository = mock(UserRepository.class);
    customUserDetailsService = new CustomUserDetailsService(userRepository);
  }

  @Test
  void loadUserByUsername_withExistingUser_returnsUserDetails() {
    User user = new User("1", "Alice", "alice@example.com", "encoded-password", List.of());

    when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));

    UserDetails userDetails = customUserDetailsService.loadUserByUsername("alice@example.com");

    assertEquals("alice@example.com", userDetails.getUsername());
    assertEquals("encoded-password", userDetails.getPassword());
    assertTrue(userDetails.getAuthorities().isEmpty());
  }

  @Test
  void loadUserByUsername_withNonExistingUser_throwsException() {
    when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

    assertThrows(UsernameNotFoundException.class, () ->
            customUserDetailsService.loadUserByUsername("notfound@example.com"));
  }

  @Test
  void loadUserByUsername_emailCaseInsensitive_stillFindsUser() {
    User user = new User("1", "Alice", "alice@example.com", "encoded-password", List.of());

    when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
    UserDetails userDetails = customUserDetailsService.loadUserByUsername("alice@example.com");
    assertEquals("alice@example.com", userDetails.getUsername());
  }
}
