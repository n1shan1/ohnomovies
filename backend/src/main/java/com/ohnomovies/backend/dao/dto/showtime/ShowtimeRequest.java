package com.ohnomovies.backend.dao.dto.showtime;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// Used for both Create and Update
@Data
public class ShowtimeRequest {
    @NotNull
    private Long movieId;

    @NotNull
    private Long screenId;

    @NotNull
    // @Future removed to allow flexible showtime creation for testing
    // In production, add business logic validation in the service layer
    private LocalDateTime startTime;

    @NotNull
    @Min(0)
    private BigDecimal price;
}
