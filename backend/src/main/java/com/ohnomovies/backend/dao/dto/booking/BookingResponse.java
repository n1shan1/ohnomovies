package com.ohnomovies.backend.dao.dto.booking;

import com.ohnomovies.backend.model.types.BookingStatus;
import com.ohnomovies.backend.model.types.Currency;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class BookingResponse {
    private UUID bookingUuid;
    private BookingStatus status;
    private String movieTitle;
    private String theaterName;
    private String screenName;
    private LocalDateTime startTime;
    private List<String> seats; // e.g., ["A1", "A2"]
    private BigDecimal totalAmount;
    private Currency currency;
    private LocalDateTime bookedAt;
}
