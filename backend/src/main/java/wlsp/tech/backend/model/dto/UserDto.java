package wlsp.tech.backend.model.dto;

import java.util.List;

public record UserDto(String nameOfUser, String email, List<String> receiptIds) {
}
