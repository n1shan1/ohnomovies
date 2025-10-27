package com.ohnomovies.backend.dao.mapper;

import com.ohnomovies.backend.dao.dto.seat.SeatDto;
import com.ohnomovies.backend.model.entity.Seat;
import org.springframework.stereotype.Component;

@Component
public class SeatMapper {

    public SeatDto toSeatDto(Seat seat) {
        SeatDto dto = new SeatDto();
        dto.setId(seat.getId());
        dto.setSeatRow(seat.getSeatRow());
        dto.setSeatNumber(seat.getSeatNumber());
        return dto;
    }
}
