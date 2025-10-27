package com.ohnomovies.backend.dao.dto.booking;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    @NotEmpty
    private List<Long> showtimeSeatIds; // The IDs of the seats the user previously locked
}
