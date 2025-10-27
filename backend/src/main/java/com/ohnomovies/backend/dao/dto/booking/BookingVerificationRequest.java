package com.ohnomovies.backend.dao.dto.booking;


import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class BookingVerificationRequest {
    @NotNull
    private UUID bookingUuid;
}