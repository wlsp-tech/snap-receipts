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

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final IdService idService;

  @PostMapping("/sign-up")
  public ResponseEntity<ApiResponse<UserDto>> register(@RequestBody RegisterRequest request) {
    if (request.nameOfUser() == null || request.nameOfUser().trim().isEmpty()) {
      return ResponseEntity.badRequest().body(
              new ApiResponse<>(false, null, "Name of user cannot be empty")
      );
    }

    if (userRepository.findByEmail(request.email()).isPresent()) {
      return ResponseEntity.badRequest().body(
              new ApiResponse<>(false, null, "User already exists")
      );
    }

    User user = new User(
            idService.generateId(),
            request.nameOfUser(),
            request.email(),
            passwordEncoder.encode(request.password())
    );
    userRepository.save(user);
    UserDto userDto = new UserDto(user.nameOfUser(), user.email());

    return ResponseEntity.ok(new ApiResponse<>(true, userDto, null));
  }

  @PostMapping("/login")
  public ResponseEntity<ApiResponse<UserDto>> login(
          @RequestBody LoginRequest request,
          HttpSession session
  ) {
    Optional<User> userOpt = userRepository.findByEmail(request.email());

    if (userOpt.isEmpty() || !passwordEncoder.matches(request.password(), userOpt.get().password())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
              .body(new ApiResponse<>(false, null, "Invalid credentials"));
    }

    User user = userOpt.get();
    session.setAttribute("user", user);

    return ResponseEntity.ok(new ApiResponse<>(true, new UserDto(user.nameOfUser(), user.email()), null));
  }

  @GetMapping("/me")
  public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(HttpSession session) {
    User user = (User) session.getAttribute("user");
    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
              .body(new ApiResponse<>(false, null, "Not logged in"));
    }

    return ResponseEntity.ok(new ApiResponse<>(true, new UserDto(user.nameOfUser(), user.email()), null));
  }

  @PostMapping("/logout")
  public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(new ApiResponse<>(true, null, null));
  }
}
