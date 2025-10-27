package com.ohnomovies.backend.repository;

import com.ohnomovies.backend.model.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingUuid(UUID bookingUuid);
    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

    // For the scheduled job
    @Modifying
    @Query("UPDATE Booking b SET b.bookingStatus = 'EXPIRED' WHERE b.bookingStatus = 'CONFIRMED' AND b.showtime.endTime < :now")
    int expireOldBookings(LocalDateTime now);
}
