package wlsp.tech.backend.service;

import org.springframework.stereotype.Service;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.repository.ReceiptRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ReceiptService {
  private final ReceiptRepository receiptRepository;

  public ReceiptService(ReceiptRepository receiptRepository) {
    this.receiptRepository = receiptRepository;
  }

  public Receipt saveReceipt(Receipt receipt) {
    return receiptRepository.save(receipt);
  }

  public List<Receipt> getAllReceipts() {
    return receiptRepository.findAll();
  }

  public List<Receipt> getReceiptsByUserId(String userId) {
    return receiptRepository.findByUserId(userId);
  }

  public Optional<Receipt> getReceiptById(String id) {
    return receiptRepository.findById(id);
  }

  public void deleteReceiptById(String receiptId) {
    receiptRepository.deleteById(receiptId);
  }
}
