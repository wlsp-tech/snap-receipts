package wlsp.tech.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import wlsp.tech.backend.model.receipt.Receipt;

public interface ReceiptRepository extends MongoRepository<Receipt, String> {
}
