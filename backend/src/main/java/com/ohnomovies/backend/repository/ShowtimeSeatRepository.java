package com.ohnomovies.backend.repository;


import com.ohnomovies.backend.model.entity.ShowtimeSeat;
import com.ohnomovies.backend.model.types.ShowtimeSeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowtimeSeatRepository extends JpaRepository<ShowtimeSeat, Long> {

    @Query("SELECT ss FROM ShowtimeSeat ss JOIN FETCH ss.seat s " +
            "WHERE ss.showtime.id = :showtimeId " +
            "ORDER BY s.seatRow ASC, s.seatNumber ASC")
    List<ShowtimeSeat> findSeatsByShowtimeId(Long showtimeId);

    // Finds a specific seat for locking
    @Query("SELECT ss FROM ShowtimeSeat ss WHERE ss.id = :id AND ss.status = 'AVAILABLE'")
    Optional<ShowtimeSeat> findAvailableSeatById(Long id);

    // Finds seats locked by a specific user for booking confirmation
    List<ShowtimeSeat> findByIdInAndStatusAndLockedByUserId(List<Long> ids, ShowtimeSeatStatus status, Long userId);

    // For the cleanup job
    @Modifying
    @Query("UPDATE ShowtimeSeat ss SET ss.status = 'AVAILABLE', ss.lockExpiresAt = null, ss.lockedByUserId = null " +
            "WHERE ss.status = 'LOCKED' AND ss.lockExpiresAt < :now")
    int unlockExpiredSeats(LocalDateTime now);
}
