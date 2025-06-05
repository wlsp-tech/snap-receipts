package wlsp.tech.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.model.token.UploadToken;
import wlsp.tech.backend.service.*;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/snap-receipts")
@CrossOrigin(origins = {"${frontend.origin}"}, allowCredentials = "true")
@RequiredArgsConstructor
public class ReceiptController {

  private final ReceiptService receiptService;
  private final SessionService sessionService;
  private final UserService userService;
  private final UploadTokenService uploadTokenService;
  private final IdService idService;
  private final CloudinaryService cloudinaryService;

  @GetMapping("/receipts")
  public ResponseEntity<List<Receipt>> getReceipts(HttpSession session) {
    return sessionService.getLoggedInUser(session)
            .map(user -> ResponseEntity.ok(receiptService.getReceiptsByUserId(user.id())))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }

  @PostMapping("/token/generate-upload-token")
  public ResponseEntity<String> generateUploadToken(HttpSession session) {
    return sessionService.getLoggedInUser(session)
            .map(user -> {
              UploadToken token = uploadTokenService.generateTokenForUser(user.id());
              return ResponseEntity.ok(token.id());
            })
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }

  @PostMapping(value = "/token/upload-by-token", consumes = {"multipart/form-data"})
  public ResponseEntity<Receipt> uploadViaToken(
          @RequestPart("file") MultipartFile file,
          @RequestParam("token") String tokenId
  ) {
    Optional<UploadToken> tokenOpt = uploadTokenService.validateToken(tokenId);
    if (tokenOpt.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    UploadToken token = tokenOpt.get();

    if (token.createdAt().isBefore(Instant.now().minusSeconds(3600))) {
      uploadTokenService.invalidateToken(token.id());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    try {
      // Upload zu Cloudinary
      String cloudinaryUrl = cloudinaryService.upLoadFile(file);

      // Receipt speichern
      Receipt receipt = new Receipt(
              idService.generateId(),
              token.userId(),
              cloudinaryUrl,
              Instant.now()
      );

      Receipt saved = receiptService.saveReceipt(receipt);
      userService.addReceiptToUser(token.userId(), saved.id());

      uploadTokenService.invalidateToken(token.id());

      return ResponseEntity.ok(saved);

    } catch (IOException e) {
      e.printStackTrace();  // Log Fehler
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
