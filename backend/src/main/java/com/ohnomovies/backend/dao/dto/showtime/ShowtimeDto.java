package com.ohnomovies.backend.dao.dto.showtime;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// A general DTO for showtime info
@Data
public class ShowtimeDto {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal price;
    private Long movieId;
    private String movieTitle;
    private Long screenId;
    private String screenName;
    private Long theaterId;
    private String theaterName;
}
