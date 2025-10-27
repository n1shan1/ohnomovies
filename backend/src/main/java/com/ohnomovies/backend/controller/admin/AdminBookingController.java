package com.ohnomovies.backend.controller.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.booking.BookingResponse;
import com.ohnomovies.backend.dao.dto.booking.BookingVerificationRequest;
import com.ohnomovies.backend.dao.dto.booking.BookingVerificationResponse;
import com.ohnomovies.backend.service.booking.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Bookings", description = "Admin endpoints for managing bookings")
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Get all bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{uuid}")
    @Operation(summary = "Get booking by UUID")
    public ResponseEntity<BookingResponse> getBookingByUuid(@PathVariable UUID uuid) {
        return ResponseEntity.ok(bookingService.getBookingByUuid(uuid));
    }

    // Endpoint for QR code scanning
    @PostMapping("/verify")
    @Operation(summary = "Verify booking")
    public ResponseEntity<BookingVerificationResponse> verifyBooking(
            @Valid @RequestBody BookingVerificationRequest request) {
        return ResponseEntity.ok(bookingService.verifyBooking(request.getBookingUuid()));
    }

    @DeleteMapping("/{uuid}")
    @Operation(summary = "Cancel booking")
    public ResponseEntity<Void> cancelBooking(@PathVariable UUID uuid) {
        bookingService.cancelBooking(uuid);
        return ResponseEntity.noContent().build();
    }
}
