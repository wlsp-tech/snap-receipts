package wlsp.tech.backend.model.dto;

import java.util.Date;
import java.util.List;

public record UserDto(
        String id,
        String nameOfUser,
        String email,
        List<String> receiptIds,
        Date createdAt
) {}
