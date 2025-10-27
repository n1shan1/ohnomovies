package com.ohnomovies.backend.dao.dto.user;

import lombok.Data;

// DTO for returning user profile details (excluding password)
@Data
public class UserProfileDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    // Add other relevant non-sensitive fields if needed
}
