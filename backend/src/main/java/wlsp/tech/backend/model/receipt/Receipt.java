package wlsp.tech.backend.model.receipt;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("receipts")
public record Receipt(
        @Id String id,
        String userId,
        String imageUri,
        Instant createdAt
) {
}
