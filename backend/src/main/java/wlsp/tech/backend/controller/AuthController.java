package wlsp.tech.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import wlsp.tech.backend.model.dto.*;
import wlsp.tech.backend.model.token.UploadToken;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.repository.UserRepository;
import wlsp.tech.backend.service.IdService;
import wlsp.tech.backend.service.SessionService;
import wlsp.tech.backend.service.UploadTokenService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"${frontend.origin}"}, allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

  private final UserRepository userRepository;
  private final SessionService sessionService;
  private final PasswordEncoder passwordEncoder;
  private final UploadTokenService uploadTokenService;
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

    UserDto userDto = new UserDto(idService.generateId(), user.getNameOfUser(), user.getEmail(), user.getReceiptIds());
    return ResponseEntity.ok(userDto);
  }

  @PostMapping("/login")
  public ResponseEntity<UserDto> login(@RequestBody LoginRequest request, HttpSession session) {
    Optional<User> userOpt = userRepository.findByEmail(request.email());

    if (userOpt.isEmpty() || !passwordEncoder.matches(request.password(), userOpt.get().getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    User user = userOpt.get();
    session.setAttribute("userId", user.getId());

    UserDto userDto = new UserDto(
            user.getId(),
            user.getNameOfUser(),
            user.getEmail(),
            user.getReceiptIds()
    );
    return ResponseEntity.ok(userDto);
  }

  @GetMapping("/me")
  public ResponseEntity<UserDto> getCurrentUser(HttpSession session) {
    return sessionService.getLoggedInUser(session)
            .map(user -> {
              UserDto userDto = new UserDto(
                      user.getId(),
                      user.getNameOfUser(),
                      user.getEmail(),
                      user.getReceiptIds()
              );
              return ResponseEntity.ok(userDto);
            })
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }

  @GetMapping("/logout")
  public ResponseEntity<Void> logout(HttpSession session) {
    try {
      if (session != null) {
        session.invalidate();
      }
      return ResponseEntity.ok().build();
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.GONE).build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/token-login")
  public ResponseEntity<UserDto> loginWithToken(@RequestBody TokenLoginReq request, HttpSession session) {
    Optional<UploadToken> uploadTokenOpt = uploadTokenService.validateToken(request.token());

    if (uploadTokenOpt.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    UploadToken uploadToken = uploadTokenOpt.get();
    Optional<User> userOpt = userRepository.findById(uploadToken.userId());

    if (userOpt.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    User user = userOpt.get();
    session.setAttribute("userId", user.getId());

    UserDto userDto = new UserDto(
            user.getId(),
            user.getNameOfUser(),
            user.getEmail(),
            user.getReceiptIds()
    );

    return ResponseEntity.ok(userDto);
  }

}
