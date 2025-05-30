package wlsp.tech.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wlsp.tech.backend.model.dto.ReceiptUploadRequest;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.service.IdService;
import wlsp.tech.backend.service.ReceiptService;

import java.util.List;

@RestController
@RequestMapping("/api/snap-receipts")
@CrossOrigin()
@RequiredArgsConstructor
public class ReceiptController {

  private final ReceiptService receiptService;
  private final IdService idService;

  @PostMapping("/upload")
  public ResponseEntity<Receipt> uploadReceipt(@RequestBody ReceiptUploadRequest request) {
    Receipt receipt = new Receipt(
            idService.generateId(),
            request.getUuid(),
            request.getImage()
    );

    Receipt saved = receiptService.saveReceipt(receipt);

    return ResponseEntity.ok(saved);
  }

  @GetMapping
  public ResponseEntity<List<Receipt>> getAllReceipts() {
    return ResponseEntity.status(HttpStatus.OK).body(receiptService.getAllReceipts());
  }
}