package wlsp.tech.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import wlsp.tech.backend.model.dto.*;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.repository.UserRepository;
import wlsp.tech.backend.service.IdService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final IdService idService;

  @PostMapping("/sign-up")
  public ResponseEntity<UserDto> register(@RequestBody RegisterRequest request) {
    if (request.nameOfUser() == null || request.nameOfUser().trim().isEmpty()) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    if (userRepository.findByEmail(request.email()).isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    User user = new User(
            idService.generateId(),
            request.nameOfUser(),
            request.email(),
            passwordEncoder.encode(request.password()),
            List.of()
    );
    userRepository.save(user);

    UserDto userDto = new UserDto(user.nameOfUser(), user.email(), user.receiptIds());
    return ResponseEntity.ok(userDto);
  }

  @PostMapping("/login")
  public ResponseEntity<UserDto> login(@RequestBody LoginRequest request, HttpSession session) {
    Optional<User> userOpt = userRepository.findByEmail(request.email());

    if (userOpt.isEmpty() || !passwordEncoder.matches(request.password(), userOpt.get().password())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    User user = userOpt.get();
    session.setAttribute("user", user);

    UserDto userDto = new UserDto(user.nameOfUser(), user.email(), user.receiptIds());
    return ResponseEntity.ok(userDto);
  }

  @GetMapping("/me")
  public ResponseEntity<UserDto> getCurrentUser(HttpSession session) {
    Object sessionUser = session.getAttribute("user");

    if (!(sessionUser instanceof User user)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    UserDto userDto = new UserDto(user.nameOfUser(), user.email(), user.receiptIds());
    return ResponseEntity.ok(userDto);
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok().build();
  }
}
