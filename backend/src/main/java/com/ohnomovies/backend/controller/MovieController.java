package com.ohnomovies.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.movie.MovieDto;
import com.ohnomovies.backend.dao.dto.showtime.ShowtimeDto;
import com.ohnomovies.backend.service.movie.MovieService;
import com.ohnomovies.backend.service.showtime.ShowtimeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
@Tag(name = "Movies", description = "Endpoints for retrieving movie information and showtimes")
public class MovieController {

    private final MovieService movieService;
    private final ShowtimeService showtimeService;

    @GetMapping
    @Operation(summary = "Get all movies")
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get movie by ID")
    public ResponseEntity<MovieDto> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @GetMapping("/{id}/showtimes")
    @Operation(summary = "Get showtimes for movie")
    public ResponseEntity<List<ShowtimeDto>> getShowtimesForMovie(@PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getShowtimesForMovie(id));
    }
}