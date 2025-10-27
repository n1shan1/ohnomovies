package com.ohnomovies.backend.service.theater;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ohnomovies.backend.dao.dto.screen.ScreenDto;
import com.ohnomovies.backend.dao.dto.screen.ScreenRequest;
import com.ohnomovies.backend.dao.dto.theater.TheaterDto;
import com.ohnomovies.backend.dao.dto.theater.TheaterRequest;
import com.ohnomovies.backend.dao.mapper.TheaterMapper;
import com.ohnomovies.backend.exception.ResourceNotFoundException;
import com.ohnomovies.backend.model.entity.Seat;
import com.ohnomovies.backend.model.entity.Theater;
import com.ohnomovies.backend.model.entity.TheaterScreen;
import com.ohnomovies.backend.repository.SeatRepository;
import com.ohnomovies.backend.repository.TheaterRepository;
import com.ohnomovies.backend.repository.TheaterScreenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TheaterServiceImpl implements TheaterService {

    private final TheaterRepository theaterRepository;
    private final TheaterScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final TheaterMapper theaterMapper;

    @Transactional
    @Override
    public TheaterDto createTheater(TheaterRequest request) {
        Theater theater = theaterMapper.toTheater(request);
        Theater savedTheater = theaterRepository.save(theater);
        return theaterMapper.toTheaterDto(savedTheater);
    }

    @Transactional(readOnly = true)
    @Override
    public List<TheaterDto> getAllTheaters() {
        return theaterRepository.findAllWithScreens().stream()
                .map(theaterMapper::toTheaterDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public TheaterDto getTheaterById(Long theaterId) {
        Theater theater = theaterRepository.findByIdWithScreens(theaterId);
        if (theater == null) {
            throw new ResourceNotFoundException("Theater not found with id: " + theaterId);
        }
        return theaterMapper.toTheaterDto(theater);
    }

    @Transactional
    @Override
    public TheaterDto updateTheater(Long theaterId, TheaterRequest request) {
        Theater theater = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + theaterId));

        theaterMapper.updateTheaterFromDto(request, theater);
        Theater updatedTheater = theaterRepository.save(theater);
        return theaterMapper.toTheaterDto(updatedTheater);
    }

    @Transactional
    @Override
    public void deleteTheater(Long theaterId) {
        if (!theaterRepository.existsById(theaterId)) {
            throw new ResourceNotFoundException("Theater not found with id: " + theaterId);
        }
        // Deleting the theater will also delete its screens and seats
        // due to `cascade = CascadeType.ALL`
        theaterRepository.deleteById(theaterId);
    }

    @Transactional
    @Override
    public ScreenDto createScreen(Long theaterId, ScreenRequest request) {
        Theater theater = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + theaterId));

        TheaterScreen screen = theaterMapper.toScreen(request);
        screen.setTheater(theater);

        TheaterScreen savedScreen = screenRepository.save(screen);

        List<Seat> seats = new ArrayList<>();
        for (int r = 0; r < request.getTotalRows(); r++) {
            String rowLetter = getRowLetter(r);
            for (int c = 1; c <= request.getTotalColumns(); c++) {
                Seat seat = new Seat();
                seat.setScreen(savedScreen);
                seat.setSeatRow(rowLetter);
                seat.setSeatNumber(c);
                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);

        return theaterMapper.toScreenDto(savedScreen);
    }

    @Transactional(readOnly = true)
    @Override
    public ScreenDto getScreenById(Long screenId) {
        TheaterScreen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + screenId));
        return theaterMapper.toScreenDto(screen);
    }

    @Transactional(readOnly = true)
    @Override
    public List<ScreenDto> getScreensForTheater(Long theaterId) {
        if (!theaterRepository.existsById(theaterId)) {
            throw new ResourceNotFoundException("Theater not found with id: " + theaterId);
        }
        List<TheaterScreen> screens = screenRepository.findByTheaterId(theaterId);
        return screens.stream()
                .map(theaterMapper::toScreenDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ScreenDto updateScreen(Long screenId, ScreenRequest request) {
        TheaterScreen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + screenId));

        // Architectural Decision:
        // We will NOT allow changing row/column counts, as this would
        // require complex logic to delete/recreate seats, which could
        // invalidate existing bookings. An update only changes the name.
        // To change layout, an admin must delete and recreate the screen.
        screen.setScreenName(request.getScreenName());

        TheaterScreen updatedScreen = screenRepository.save(screen);
        return theaterMapper.toScreenDto(updatedScreen);
    }

    @Transactional
    @Override
    public void deleteScreen(Long screenId) {
        if (!screenRepository.existsById(screenId)) {
            throw new ResourceNotFoundException("Screen not found with id: " + screenId);
        }
        // CascadeType.ALL on the 'seats' relationship will handle
        // deleting all child seats automatically.
        screenRepository.deleteById(screenId);
    }

    @Override
    public String getRowLetter(int rowIndex) {
        StringBuilder letter = new StringBuilder();
        while (rowIndex >= 0) {
            letter.insert(0, (char) ('A' + rowIndex % 26));
            rowIndex = (rowIndex / 26) - 1;
        }
        return letter.toString();
    }
}
