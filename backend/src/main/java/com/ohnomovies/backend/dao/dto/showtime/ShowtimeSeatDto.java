package com.ohnomovies.backend.dao.dto.showtime;

import com.ohnomovies.backend.model.types.ShowtimeSeatStatus;
import lombok.Data;

// This DTO is for the public-facing seat map
@Data
public class ShowtimeSeatDto {
    private Long id; // The ShowtimeSeat ID
    private String seatRow;
    private Integer seatNumber;
    private ShowtimeSeatStatus status;
    private Long version; // Important for booking
}
