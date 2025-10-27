package com.ohnomovies.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.showtime.ShowtimeDto;
import com.ohnomovies.backend.dao.dto.showtime.ShowtimeSeatDto;
import com.ohnomovies.backend.service.showtime.ShowtimeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/showtimes") // Public endpoint
@RequiredArgsConstructor
@Tag(name = "Showtimes", description = "Endpoints for retrieving showtime information and seat maps")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    // Get details for a single showtime
    @GetMapping("/{id}")
    @Operation(summary = "Get showtime by ID")
    public ResponseEntity<ShowtimeDto> getShowtimeById(@PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getShowtimeById(id));
    }

    // This is the main endpoint a user hits to see the seat map
    @GetMapping("/{id}/seats")
    @Operation(summary = "Get seat map for showtime")
    public ResponseEntity<List<ShowtimeSeatDto>> getSeatMapForShowtime(@PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getSeatMapForShowtime(id));
    }
}
