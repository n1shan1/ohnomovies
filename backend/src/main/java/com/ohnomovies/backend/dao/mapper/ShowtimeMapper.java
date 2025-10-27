package com.ohnomovies.backend.dao.mapper;


import com.ohnomovies.backend.dao.dto.showtime.ShowtimeDto;
import com.ohnomovies.backend.dao.dto.showtime.ShowtimeSeatDto;
import com.ohnomovies.backend.model.entity.Showtime;
import com.ohnomovies.backend.model.entity.ShowtimeSeat;
import org.springframework.stereotype.Component;

@Component
public class ShowtimeMapper {

    public ShowtimeDto toShowtimeDto(Showtime showtime) {
        ShowtimeDto dto = new ShowtimeDto();
        dto.setId(showtime.getId());
        dto.setStartTime(showtime.getStartTime());
        dto.setEndTime(showtime.getEndTime());
        dto.setPrice(showtime.getPrice());
        dto.setMovieId(showtime.getMovie().getId());
        dto.setMovieTitle(showtime.getMovie().getTitle());
        dto.setScreenId(showtime.getScreen().getId());
        dto.setScreenName(showtime.getScreen().getScreenName());
        dto.setTheaterId(showtime.getScreen().getTheater().getId());
        dto.setTheaterName(showtime.getScreen().getTheater().getName());
        return dto;
    }

    public ShowtimeSeatDto toShowtimeSeatDto(ShowtimeSeat showtimeSeat) {
        ShowtimeSeatDto dto = new ShowtimeSeatDto();
        dto.setId(showtimeSeat.getId());
        dto.setStatus(showtimeSeat.getStatus());
        dto.setVersion(showtimeSeat.getVersion());
        dto.setSeatRow(showtimeSeat.getSeat().getSeatRow());
        dto.setSeatNumber(showtimeSeat.getSeat().getSeatNumber());
        return dto;
    }
}