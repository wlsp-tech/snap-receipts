package wlsp.tech.backend.model.receipt;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Receipts")
public record Receipt(
        @Id String id,
        String uuid,
        String base64Image
) {
}
