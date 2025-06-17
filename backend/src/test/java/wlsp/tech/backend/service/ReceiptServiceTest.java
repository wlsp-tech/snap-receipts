package wlsp.tech.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.repository.ReceiptRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
    Receipt receipt = new Receipt(
            "1",
            "user123",
            "https://image.jpg",
            Instant.now(),
            "REWE",
            new BigDecimal("5.55"),
            LocalDate.of(2025, 6, 17),
            "Food"
    );

    when(receiptRepository.save(receipt)).thenReturn(receipt);

    Receipt result = receiptService.saveReceipt(receipt);

    assertEquals(receipt, result);
    verify(receiptRepository).save(receipt);
  }

  @Test
  void getAllReceipts_shouldReturnAllReceipts() {
    List<Receipt> receipts = List.of(
            new Receipt(
                    "1",
                    "user123",
                    "https://image.jpg",
                    Instant.now(),
                    "REWE",
                    new BigDecimal("5.55"),
                    LocalDate.of(2025, 6, 17),
                    "Food"
            ),
            new Receipt(
                    "3",
                    "user1233",
                    "https://image.jpg3",
                    Instant.now(),
                    "REWE",
                    new BigDecimal("5.55"),
                    LocalDate.of(2025, 6, 17),
                    "Food"
            )
    );

    when(receiptRepository.findAll()).thenReturn(receipts);

    List<Receipt> result = receiptService.getAllReceipts();

    assertEquals(receipts.size(), result.size());
    assertIterableEquals(receipts, result);
    verify(receiptRepository).findAll();
  }

  @Test
  void getReceiptsByIdsAndUserId_shouldReturnMatchingReceipts() {
    String userId = "user123";
    List<String> receiptIds = List.of("1", "2");
    List<Receipt> expectedReceipts = List.of(
            new Receipt(
                    "1",
                    "user123",
                    "https://image.jpg",
                    Instant.now(),
                    "REWE",
                    new BigDecimal("5.55"),
                    LocalDate.of(2025, 6, 17),
                    "Food"
            ),
            new Receipt(
                    "3",
                    "user1233",
                    "https://image.jpg",
                    Instant.now(),
                    "REWE",
                    new BigDecimal("5.55"),
                    LocalDate.of(2025, 6, 17),
                    "Food"
            )
    );

    when(receiptRepository.findByIdInAndUserId(receiptIds, userId)).thenReturn(expectedReceipts);

    List<Receipt> result = receiptService.getReceiptsByIdsAndUserId(receiptIds, userId);

    assertEquals(expectedReceipts, result);
    verify(receiptRepository).findByIdInAndUserId(receiptIds, userId);
  }

  @Test
  void getReceiptsByIdsAndUserId_shouldReturnEmptyListWhenIdsNull() {
    List<Receipt> result = receiptService.getReceiptsByIdsAndUserId(null, "user123");

    assertTrue(result.isEmpty());
    verify(receiptRepository, never()).findByIdInAndUserId(anyList(), anyString());
  }

  @Test
  void getReceiptsByIdsAndUserId_shouldReturnEmptyListWhenIdsEmpty() {
    List<Receipt> result = receiptService.getReceiptsByIdsAndUserId(Collections.emptyList(), "user123");

    assertTrue(result.isEmpty());
    verify(receiptRepository, never()).findByIdInAndUserId(anyList(), anyString());
  }

  @Test
  void deleteReceiptById_shouldCallRepositoryDeleteById() {
    String receiptId = "receipt123";

    receiptService.deleteReceiptById(receiptId);

    verify(receiptRepository).deleteById(receiptId);
  }

  @Test
  void getReceiptById_shouldReturnReceiptIfExists() {
    String id = "receipt1";
    Receipt receipt = new Receipt(
            id,
            "user123",
            "https://image.jpg",
            Instant.now(),
            "REWE",
            new BigDecimal("5.55"),
            LocalDate.of(2025, 6, 17),
            "Food"
    );

    when(receiptRepository.findById(id)).thenReturn(Optional.of(receipt));

    Optional<Receipt> result = receiptService.getReceiptById(id);

    assertTrue(result.isPresent());
    assertEquals(receipt, result.get());
    verify(receiptRepository).findById(id);
  }

  @Test
  void getReceiptById_shouldReturnEmptyIfNotExists() {
    String id = "nonexistent";

    when(receiptRepository.findById(id)).thenReturn(Optional.empty());

    Optional<Receipt> result = receiptService.getReceiptById(id);

    assertTrue(result.isEmpty());
    verify(receiptRepository).findById(id);
  }
}
