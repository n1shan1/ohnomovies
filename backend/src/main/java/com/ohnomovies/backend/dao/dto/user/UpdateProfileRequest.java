package com.ohnomovies.backend.dao.dto.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

// DTO for updating user profile
@Data
public class UpdateProfileRequest {
    @NotEmpty
    private String firstName;

    @NotEmpty
    private String lastName;
    // Note: Email/Password updates are typically handled via separate, more secure flows.
}
