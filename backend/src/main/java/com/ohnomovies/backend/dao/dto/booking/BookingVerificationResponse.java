package com.ohnomovies.backend.dao.dto.booking;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingVerificationResponse {
    private boolean valid;
    private String message;
    private BookingResponse bookingDetails; // Can be null if invalid
}
