package wlsp.tech.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wlsp.tech.backend.model.dto.ReceiptUploadRequest;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.model.token.UploadToken;
import wlsp.tech.backend.model.user.User;
import wlsp.tech.backend.service.IdService;
import wlsp.tech.backend.service.ReceiptService;
import wlsp.tech.backend.service.UploadTokenService;
import wlsp.tech.backend.service.UserService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/snap-receipts")
@CrossOrigin()
@RequiredArgsConstructor
public class ReceiptController {

  private final ReceiptService receiptService;
  private final UserService userService;
  private final UploadTokenService uploadTokenService;
  private final IdService idService;

/*
  @PostMapping("/upload")
  public ResponseEntity<Receipt> uploadReceipt(@RequestBody ReceiptUploadRequest request, HttpSession session) {

    User user = (User) session.getAttribute("user");

    if (user == null) {
      return null;
    }

    Receipt receipt = new Receipt(
            idService.generateId(),
            user.id(),
            request.getImage()
    );

    Receipt savedReceipt = receiptService.saveReceipt(receipt);

    userService.addReceiptToUser(user.id(), savedReceipt.id());

    return ResponseEntity.ok(savedReceipt);
  }

  @GetMapping
  public ResponseEntity<List<Receipt>> getAllReceipts() {
    return ResponseEntity.status(HttpStatus.OK).body(receiptService.getAllReceipts());
  }
 */

  @GetMapping("/receipts")
  public ResponseEntity<List<Receipt>> getMyReceipts(HttpSession session) {
    User user = (User) session.getAttribute("user");
    if (user == null) {
      return null;
    }

    var receipts = receiptService.getReceiptsByUserId(user.id());
    return ResponseEntity.ok(receipts);
  }

  @PostMapping("/token/generate-upload-token")
  public ResponseEntity<String> generateUploadToken(HttpSession session) {
    User user = (User) session.getAttribute("user");
    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    UploadToken token = uploadTokenService.generateTokenForUser(user.id());
    return ResponseEntity.ok(token.id());
  }

  @PostMapping("/token/upload-by-token")
  public ResponseEntity<Receipt> uploadViaToken(@RequestBody ReceiptUploadRequest request) {
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