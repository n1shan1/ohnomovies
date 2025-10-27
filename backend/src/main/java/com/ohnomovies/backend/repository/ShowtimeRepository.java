package com.ohnomovies.backend.repository;


import com.ohnomovies.backend.model.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    // Find all showtimes for a specific movie, after a certain time
    List<Showtime> findByMovieIdAndStartTimeAfter(Long movieId, LocalDateTime afterTime);

    // Find all showtimes for a specific theater
    List<Showtime> findByScreenTheaterId(Long theaterId);

    // Find all showtimes for a specific theater
    List<Showtime> findByScreenTheaterIdAndStartTimeAfter(Long theaterId, LocalDateTime afterTime);
}
