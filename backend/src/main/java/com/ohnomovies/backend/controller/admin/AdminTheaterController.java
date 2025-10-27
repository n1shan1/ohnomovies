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

import com.ohnomovies.backend.dao.dto.screen.ScreenDto;
import com.ohnomovies.backend.dao.dto.screen.ScreenRequest;
import com.ohnomovies.backend.dao.dto.theater.TheaterDto;
import com.ohnomovies.backend.dao.dto.theater.TheaterRequest;
import com.ohnomovies.backend.service.theater.TheaterService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/theaters")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')") // Secures all methods in this controller
@Tag(name = "Admin Theaters", description = "Admin endpoints for managing theaters and screens")
public class AdminTheaterController {

    private final TheaterService theaterService;

    // --- Theater Endpoints ---

    @PostMapping
    @Operation(summary = "Create theater")
    public ResponseEntity<TheaterDto> createTheater(@Valid @RequestBody TheaterRequest request) {
        TheaterDto createdTheater = theaterService.createTheater(request);
        return new ResponseEntity<>(createdTheater, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all theaters")
    public ResponseEntity<List<TheaterDto>> getAllTheaters() {
        return ResponseEntity.ok(theaterService.getAllTheaters());
    }

    @GetMapping("/{theaterId}")
    @Operation(summary = "Get theater by ID")
    public ResponseEntity<TheaterDto> getTheaterById(@PathVariable Long theaterId) {
        return ResponseEntity.ok(theaterService.getTheaterById(theaterId));
    }

    @PutMapping("/{theaterId}")
    @Operation(summary = "Update theater")
    public ResponseEntity<TheaterDto> updateTheater(@PathVariable Long theaterId,
            @Valid @RequestBody TheaterRequest request) {
        return ResponseEntity.ok(theaterService.updateTheater(theaterId, request));
    }

    @DeleteMapping("/{theaterId}")
    @Operation(summary = "Delete theater")
    public ResponseEntity<Void> deleteTheater(@PathVariable Long theaterId) {
        theaterService.deleteTheater(theaterId);
        return ResponseEntity.noContent().build();
    }

    // --- Screen Endpoint ---

    @PostMapping("/{theaterId}/screens")
    @Operation(summary = "Create screen")
    public ResponseEntity<ScreenDto> createScreen(
            @PathVariable Long theaterId,
            @Valid @RequestBody ScreenRequest request) {
        ScreenDto createdScreen = theaterService.createScreen(theaterId, request);
        return new ResponseEntity<>(createdScreen, HttpStatus.CREATED);
    }

    @GetMapping("/{theaterId}/screens")
    @Operation(summary = "Get screens for theater")
    public ResponseEntity<List<ScreenDto>> getScreensForTheater(@PathVariable Long theaterId) {
        return ResponseEntity.ok(theaterService.getScreensForTheater(theaterId));
    }

    @GetMapping("/screens/{screenId}")
    @Operation(summary = "Get screen by ID")
    public ResponseEntity<ScreenDto> getScreenById(@PathVariable Long screenId) {
        return ResponseEntity.ok(theaterService.getScreenById(screenId));
    }

    @PutMapping("/screens/{screenId}")
    @Operation(summary = "Update screen")
    public ResponseEntity<ScreenDto> updateScreen(
            @PathVariable Long screenId,
            @Valid @RequestBody ScreenRequest request) { // Reuses ScreenRequest for name change
        return ResponseEntity.ok(theaterService.updateScreen(screenId, request));
    }

    @DeleteMapping("/screens/{screenId}")
    @Operation(summary = "Delete screen")
    public ResponseEntity<Void> deleteScreen(@PathVariable Long screenId) {
        theaterService.deleteScreen(screenId);
        return ResponseEntity.noContent().build();
    }

    // You would add PUT/DELETE for screens here as well if needed
}
