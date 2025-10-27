package com.ohnomovies.backend.dao.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class AuthRequest {
    @NotEmpty
    @Email
    private String email;

    @NotEmpty
    private String password;
}
