package wlsp.tech.backend.model.dto;

import java.util.Date;

public record RegisterRequest(String nameOfUser, String email, String password, Date createdAt) {}
