package wlsp.tech.backend.model.receipt;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Document("receipts")
public record Receipt(
        @Id String id,
        String userId,
        String imageUri,
        Instant createdAt,
        String company,
        BigDecimal amount,
        LocalDate date,
        String category
) {}
