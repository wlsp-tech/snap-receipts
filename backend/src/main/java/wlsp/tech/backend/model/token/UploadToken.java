package wlsp.tech.backend.model.token;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("uploadTokens")
public record UploadToken(
        @Id String id,
        String userId,
        Instant createdAt
) {}