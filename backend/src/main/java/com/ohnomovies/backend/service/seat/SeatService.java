package com.ohnomovies.backend.service.seat;

import com.ohnomovies.backend.dao.dto.seat.SeatDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SeatService {
    @Transactional(readOnly = true)
    List<SeatDto> getSeatsForScreen(Long screenId);
}
