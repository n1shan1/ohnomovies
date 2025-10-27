package com.ohnomovies.backend.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.showtime.ShowtimeDto;
import com.ohnomovies.backend.dao.dto.showtime.ShowtimeRequest;
import com.ohnomovies.backend.service.showtime.ShowtimeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/showtimes")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Showtimes", description = "Admin endpoints for managing showtimes")
public class AdminShowtimeController {

    private final ShowtimeService showtimeService;

    @GetMapping
    @Operation(summary = "Get all showtimes")
    public ResponseEntity<List<ShowtimeDto>> getAllShowtimes() {
        return ResponseEntity.ok(showtimeService.getAllShowtimes());
    }

    @PostMapping
    @Operation(summary = "Create showtime")
    public ResponseEntity<ShowtimeDto> createShowtime(@Valid @RequestBody ShowtimeRequest request) {
        ShowtimeDto createdShowtime = showtimeService.createShowtime(request);
        return new ResponseEntity<>(createdShowtime, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get showtime by ID")
    public ResponseEntity<ShowtimeDto> getShowtimeById(@PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getShowtimeById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update showtime")
    public ResponseEntity<ShowtimeDto> updateShowtime(@PathVariable Long id,
            @Valid @RequestBody ShowtimeRequest request) {
        return ResponseEntity.ok(showtimeService.updateShowtime(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete showtime")
    public ResponseEntity<Void> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }
}
