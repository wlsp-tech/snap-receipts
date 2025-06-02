package wlsp.tech.backend.model.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("Users")
public record User(
        @Id String id,
        String nameOfUser,
        String email,
        String password,
        List<String> receiptIds
) {}
