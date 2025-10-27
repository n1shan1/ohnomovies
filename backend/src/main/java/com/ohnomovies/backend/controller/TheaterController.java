package com.ohnomovies.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.showtime.ShowtimeDto;
import com.ohnomovies.backend.dao.dto.theater.TheaterDto;
import com.ohnomovies.backend.service.showtime.ShowtimeService;
import com.ohnomovies.backend.service.theater.TheaterService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/theaters") // Public endpoint
@RequiredArgsConstructor
@Tag(name = "Theaters", description = "Endpoints for retrieving theater information and showtimes")
public class TheaterController {

    private final TheaterService theaterService;
    private final ShowtimeService showtimeService;

    @GetMapping
    @Operation(summary = "Get all theaters")
    public ResponseEntity<List<TheaterDto>> getAllTheaters() {
        // We use the existing admin-focused service method
        return ResponseEntity.ok(theaterService.getAllTheaters());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get theater by ID")
    public ResponseEntity<TheaterDto> getTheaterById(@PathVariable Long id) {
        return ResponseEntity.ok(theaterService.getTheaterById(id));
    }

    // Get all showtimes for a specific theater
    @GetMapping("/{id}/showtimes")
    @Operation(summary = "Get showtimes for theater")
    public ResponseEntity<List<ShowtimeDto>> getShowtimesForTheater(@PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getShowtimesForTheater(id));
    }
}
