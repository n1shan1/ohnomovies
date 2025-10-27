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

import com.ohnomovies.backend.dao.dto.movie.CreateMovieRequest;
import com.ohnomovies.backend.dao.dto.movie.MovieDto;
import com.ohnomovies.backend.service.movie.MovieService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/movies")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Movies", description = "Admin endpoints for managing movies")
public class AdminMovieController {

    private final MovieService movieService;

    @GetMapping
    @Operation(summary = "Get all movies")
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @PostMapping
    @Operation(summary = "Create movie")
    public ResponseEntity<MovieDto> createMovie(@Valid @RequestBody CreateMovieRequest request) {
        MovieDto createdMovie = movieService.createMovie(request);
        return new ResponseEntity<>(createdMovie, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update movie")
    public ResponseEntity<MovieDto> updateMovie(@PathVariable Long id,
            @Valid @RequestBody CreateMovieRequest request) {
        MovieDto updatedMovie = movieService.updateMovie(id, request);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete movie")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build(); // Standard for a successful DELETE
    }
}