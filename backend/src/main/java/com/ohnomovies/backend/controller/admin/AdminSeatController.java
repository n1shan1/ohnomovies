package com.ohnomovies.backend.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.seat.SeatDto;
import com.ohnomovies.backend.service.seat.SeatService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Seats", description = "Admin endpoints for viewing seat configurations")
public class AdminSeatController {

    private final SeatService seatService;

    // This is a READ-ONLY endpoint for admins to verify a screen's layout.
    @GetMapping("/screens/{screenId}/seats")
    @Operation(summary = "Get seats for screen")
    public ResponseEntity<List<SeatDto>> getSeatsForScreen(@PathVariable Long screenId) {
        return ResponseEntity.ok(seatService.getSeatsForScreen(screenId));
    }

    // We intentionally do not provide POST, PUT, or DELETE for individual seats.
    // They are managed automatically when a Screen is created or deleted.
}
