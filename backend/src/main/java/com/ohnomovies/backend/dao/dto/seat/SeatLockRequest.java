package com.ohnomovies.backend.dao.dto.seat;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatLockRequest {
    @NotNull
    private Long showtimeSeatId;
}
