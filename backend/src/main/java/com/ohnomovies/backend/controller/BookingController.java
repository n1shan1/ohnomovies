package com.ohnomovies.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.booking.BookingRequest;
import com.ohnomovies.backend.dao.dto.booking.BookingResponse;
import com.ohnomovies.backend.dao.dto.seat.SeatLockRequest;
import com.ohnomovies.backend.model.entity.User;
import com.ohnomovies.backend.service.booking.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Endpoints for managing movie ticket bookings")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/seats/lock")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lock a seat for booking")
    public ResponseEntity<Void> lockSeat(@Valid @RequestBody SeatLockRequest request,
            @AuthenticationPrincipal User user) {
        bookingService.lockSeat(request.getShowtimeSeatId(), user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bookings")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a booking")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal User user) {
        BookingResponse response = bookingService.createBooking(request, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/bookings/my-bookings")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user's bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getMyBookings(user));
    }

    @GetMapping("/bookings/{uuid}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get booking by UUID")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable UUID uuid,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getUserBookingByUuid(uuid, user));
    }
}
