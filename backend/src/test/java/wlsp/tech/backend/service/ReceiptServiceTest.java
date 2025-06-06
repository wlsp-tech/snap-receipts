package wlsp.tech.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.repository.ReceiptRepository;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReceiptServiceTest {

  private ReceiptRepository receiptRepository;
  private ReceiptService receiptService;

  @BeforeEach
  void setUp() {
    receiptRepository = mock(ReceiptRepository.class);
    receiptService = new ReceiptService(receiptRepository);
  }

  @Test
  void saveReceipt_shouldReturnSavedReceipt() {
    Receipt receipt = new Receipt("1", "user123", "https://image.jpg", Instant.now());

    when(receiptRepository.save(receipt)).thenReturn(receipt);

    Receipt result = receiptService.saveReceipt(receipt);

    assertEquals(receipt, result);
    verify(receiptRepository).save(receipt);
  }

  @Test
  void getAllReceipts_shouldReturnAllReceipts() {
    List<Receipt> receipts = List.of(
            new Receipt("1", "user1", "uri1", Instant.now()),
            new Receipt("2", "user2", "uri2", Instant.now())
    );

    when(receiptRepository.findAll()).thenReturn(receipts);

    List<Receipt> result = receiptService.getAllReceipts();

    assertEquals(receipts.size(), result.size());
    assertIterableEquals(receipts, result);
    verify(receiptRepository).findAll();
  }

  @Test
  void getReceiptsByUserId_shouldReturnUserReceipts() {
    String userId = "user123";
    List<Receipt> userReceipts = List.of(
            new Receipt("1", userId, "uri1", Instant.now())
    );

    when(receiptRepository.findByUserId(userId)).thenReturn(userReceipts);

    List<Receipt> result = receiptService.getReceiptsByUserId(userId);

    assertEquals(1, result.size());
    assertEquals(userId, result.getFirst().userId());
    verify(receiptRepository).findByUserId(userId);
  }

  @Test
  void deleteReceiptById_shouldCallRepositoryDeleteById() {
    String receiptId = "receipt123";

    receiptService.deleteReceiptById(receiptId);

    verify(receiptRepository).deleteById(receiptId);
  }
}
