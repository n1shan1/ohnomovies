package com.ohnomovies.backend.service.showtime;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.ohnomovies.backend.dao.dto.showtime.ShowtimeDto;
import com.ohnomovies.backend.dao.dto.showtime.ShowtimeRequest;
import com.ohnomovies.backend.dao.dto.showtime.ShowtimeSeatDto;

public interface ShowtimeService {
    @Transactional(readOnly = true)
    List<ShowtimeDto> getAllShowtimes();

    @Transactional
    ShowtimeDto createShowtime(ShowtimeRequest request);

    @Transactional
    ShowtimeDto updateShowtime(Long showtimeId, ShowtimeRequest request);

    @Transactional
    void deleteShowtime(Long showtimeId);

    @Transactional(readOnly = true)
    ShowtimeDto getShowtimeById(Long showtimeId);

    @Transactional(readOnly = true)
    List<ShowtimeDto> getShowtimesForMovie(Long movieId);

    @Transactional(readOnly = true)
    List<ShowtimeDto> getShowtimesForTheater(Long theaterId);

    @Transactional(readOnly = true)
    List<ShowtimeSeatDto> getSeatMapForShowtime(Long showtimeId);
}
