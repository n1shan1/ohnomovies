package com.ohnomovies.backend.dao.dto.seat;

import lombok.Data;

@Data
public class SeatDto {
    private Long id;
    private String seatRow;
    private Integer seatNumber;
}
