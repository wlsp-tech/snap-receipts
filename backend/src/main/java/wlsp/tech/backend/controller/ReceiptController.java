package wlsp.tech.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wlsp.tech.backend.model.dto.ReceiptUploadRequest;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.model.token.UploadToken;
import wlsp.tech.backend.service.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/snap-receipts")
@CrossOrigin()
@RequiredArgsConstructor
public class ReceiptController {

  private final ReceiptService receiptService;
  private final SessionService sessionService;
  private final UserService userService;
  private final UploadTokenService uploadTokenService;
  private final IdService idService;

  @GetMapping("/receipts")
  public ResponseEntity<List<Receipt>> getReceipts(HttpSession session) {
    return sessionService.getLoggedInUser(session)
            .map(user -> ResponseEntity.ok(receiptService.getReceiptsByUserId(user.id())))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }

  @PostMapping("/token/upload-by-token")
  public ResponseEntity<Receipt> uploadViaToken(@RequestBody ReceiptUploadRequest request, HttpSession session) {
    Optional<UploadToken> tokenOpt = uploadTokenService.validateToken(request.getToken());
    if (tokenOpt.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    UploadToken token = tokenOpt.get();

    Receipt receipt = new Receipt(
            idService.generateId(),
            token.userId(),
            request.getImageUri(),
            Instant.now()
    );

    Receipt saved = receiptService.saveReceipt(receipt);
    userService.addReceiptToUser(token.userId(), saved.id());

    uploadTokenService.invalidateToken(token.id());

    return ResponseEntity.ok(saved);
  }



}