package com.ohnomovies.backend.service.showtime;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ohnomovies.backend.dao.dto.showtime.ShowtimeDto;
import com.ohnomovies.backend.dao.dto.showtime.ShowtimeRequest;
import com.ohnomovies.backend.dao.dto.showtime.ShowtimeSeatDto;
import com.ohnomovies.backend.dao.mapper.ShowtimeMapper;
import com.ohnomovies.backend.exception.ResourceNotFoundException;
import com.ohnomovies.backend.model.entity.Movie;
import com.ohnomovies.backend.model.entity.Seat;
import com.ohnomovies.backend.model.entity.Showtime;
import com.ohnomovies.backend.model.entity.ShowtimeSeat;
import com.ohnomovies.backend.model.entity.TheaterScreen;
import com.ohnomovies.backend.model.types.ShowtimeSeatStatus;
import com.ohnomovies.backend.repository.MovieRepository;
import com.ohnomovies.backend.repository.ShowtimeRepository;
import com.ohnomovies.backend.repository.ShowtimeSeatRepository;
import com.ohnomovies.backend.repository.TheaterScreenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeSeatRepository showtimeSeatRepository;
    private final MovieRepository movieRepository;
    private final TheaterScreenRepository screenRepository;
    private final ShowtimeMapper showtimeMapper;

    @Transactional(readOnly = true)
    @Override
    public List<ShowtimeDto> getAllShowtimes() {
        return showtimeRepository.findAll().stream()
                .map(showtimeMapper::toShowtimeDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ShowtimeDto createShowtime(ShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        TheaterScreen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found"));

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setScreen(screen);
        showtime.setStartTime(request.getStartTime());
        showtime.setPrice(request.getPrice());
        showtime.setEndTime(request.getStartTime().plusMinutes(movie.getDurationInMinutes()));

        Showtime savedShowtime = showtimeRepository.save(showtime);

        Set<Seat> blueprintSeats = screen.getSeats();
        Set<ShowtimeSeat> inventorySeats = new HashSet<>();

        for (Seat seat : blueprintSeats) {
            ShowtimeSeat showtimeSeat = new ShowtimeSeat();
            showtimeSeat.setShowtime(savedShowtime);
            showtimeSeat.setSeat(seat);
            showtimeSeat.setStatus(ShowtimeSeatStatus.AVAILABLE);
            showtimeSeat.setVersion(0L);
            inventorySeats.add(showtimeSeat);
        }
        showtimeSeatRepository.saveAll(inventorySeats);

        return showtimeMapper.toShowtimeDto(savedShowtime);
    }

    @Transactional
    @Override
    public ShowtimeDto updateShowtime(Long showtimeId, ShowtimeRequest request) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        TheaterScreen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found"));

        // Note: Changing the screen for a showtime with bookings is complex.
        // For this MVP, we assume it's only allowed before any bookings are made.
        if (!Objects.equals(showtime.getScreen().getId(), screen.getId())) {
            throw new IllegalArgumentException(
                    "Cannot change the screen of an existing showtime. Delete and recreate.");
        }

        showtime.setMovie(movie);
        showtime.setScreen(screen);
        showtime.setStartTime(request.getStartTime());
        showtime.setPrice(request.getPrice());
        showtime.setEndTime(request.getStartTime().plusMinutes(movie.getDurationInMinutes()));

        Showtime updatedShowtime = showtimeRepository.save(showtime);
        return showtimeMapper.toShowtimeDto(updatedShowtime);
    }

    @Transactional
    @Override
    public void deleteShowtime(Long showtimeId) {
        if (!showtimeRepository.existsById(showtimeId)) {
            throw new ResourceNotFoundException("Showtime not found");
        }
        // Deleting the showtime will cascade and delete all associated ShowtimeSeats.
        showtimeRepository.deleteById(showtimeId);
    }

    @Transactional(readOnly = true)
    @Override
    public ShowtimeDto getShowtimeById(Long showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));
        return showtimeMapper.toShowtimeDto(showtime);
    }

    @Transactional(readOnly = true)
    @Override
    public List<ShowtimeDto> getShowtimesForMovie(Long movieId) {
        return showtimeRepository.findByMovieIdAndStartTimeAfter(movieId, LocalDateTime.now())
                .stream()
                .map(showtimeMapper::toShowtimeDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<ShowtimeDto> getShowtimesForTheater(Long theaterId) {
        return showtimeRepository.findByScreenTheaterIdAndStartTimeAfter(theaterId, LocalDateTime.now())
                .stream()
                .map(showtimeMapper::toShowtimeDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<ShowtimeSeatDto> getSeatMapForShowtime(Long showtimeId) {
        if (!showtimeRepository.existsById(showtimeId)) {
            throw new ResourceNotFoundException("Showtime not found");
        }

        List<ShowtimeSeat> seats = showtimeSeatRepository.findSeatsByShowtimeId(showtimeId);
        return seats.stream()
                .map(showtimeMapper::toShowtimeSeatDto)
                .collect(Collectors.toList());
    }
}