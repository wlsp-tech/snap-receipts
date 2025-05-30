package wlsp.tech.backend.service;

import org.springframework.stereotype.Service;
import wlsp.tech.backend.model.receipt.Receipt;
import wlsp.tech.backend.repository.ReceiptRepository;

import java.util.List;

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

}
