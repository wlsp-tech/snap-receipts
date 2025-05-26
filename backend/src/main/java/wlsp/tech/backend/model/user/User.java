package wlsp.tech.backend.model.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public record User(
        @Id
        String id,
        String email,
        String password
) {}
