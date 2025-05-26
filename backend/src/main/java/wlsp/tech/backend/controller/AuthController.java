package wlsp.tech.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import wlsp.tech.backend.model.dto.LoginRequest;
import wlsp.tech.backend.model.dto.RegisterRequest;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.repository.UserRepository;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    if (userRepository.findByEmail(request.email()).isPresent()) {
      return ResponseEntity.badRequest().body("User already exists");
    }

    User user = new User(null, request.email(), passwordEncoder.encode(request.password()));
    userRepository.save(user);
    return ResponseEntity.ok("User registered");
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    return userRepository.findByEmail(request.email())
            .filter(user -> passwordEncoder.matches(request.password(), user.password()))
            .map(user -> ResponseEntity.ok("Login successful"))
            .orElse(ResponseEntity.status(401).body("Invalid credentials"));
  }
}
