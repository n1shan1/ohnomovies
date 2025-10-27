package com.ohnomovies.backend.model.entity;

import java.time.LocalDateTime;

import com.ohnomovies.backend.model.types.ShowtimeSeatStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "showtime_seats", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "showtime_id", "seat_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShowtimeSeatStatus status = ShowtimeSeatStatus.AVAILABLE;

    @Version
    @Column(nullable = false)
    private Long version;

    @Column(nullable = true)
    private LocalDateTime lockExpiresAt;

    @Column(nullable = true)
    private Long lockedByUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
