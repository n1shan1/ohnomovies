package com.ohnomovies.backend.dao.dto.theater;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

// Used for both Create and Update
@Data
public class TheaterRequest {
    @NotEmpty
    private String name;

    @NotEmpty
    private String location;
}
