package com.ohnomovies.backend.service.seat;

import com.ohnomovies.backend.dao.dto.seat.SeatDto;
import com.ohnomovies.backend.dao.mapper.SeatMapper;
import com.ohnomovies.backend.exception.ResourceNotFoundException;
import com.ohnomovies.backend.model.entity.Seat;
import com.ohnomovies.backend.repository.SeatRepository;
import com.ohnomovies.backend.repository.TheaterScreenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final TheaterScreenRepository screenRepository;
    private final SeatMapper seatMapper;

    @Transactional(readOnly = true)
    @Override
    public List<SeatDto> getSeatsForScreen(Long screenId) {
        if (!screenRepository.existsById(screenId)) {
            throw new ResourceNotFoundException("Screen not found with id: " + screenId);
        }

        List<Seat> seats = seatRepository.findByScreenIdOrderBySeatRowAscSeatNumberAsc(screenId);
        return seats.stream()
                .map(seatMapper::toSeatDto)
                .collect(Collectors.toList());
    }
}
