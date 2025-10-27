package com.ohnomovies.backend.dao.mapper;


import com.ohnomovies.backend.dao.dto.movie.CreateMovieRequest;
import com.ohnomovies.backend.dao.dto.movie.MovieDto;
import com.ohnomovies.backend.model.entity.Movie;
import org.springframework.stereotype.Component;

@Component
public class MovieMapper {

    // Converts a DTO to a new Movie entity for creation
    public Movie toMovie(CreateMovieRequest request) {
        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setDurationInMinutes(request.getDurationInMinutes());
        movie.setLanguage(request.getLanguage());
        return movie;
    }

    // Converts a Movie entity to a DTO for responses
    public MovieDto toMovieDto(Movie movie) {
        MovieDto dto = new MovieDto();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setDescription(movie.getDescription());
        dto.setPosterUrl(movie.getPosterUrl());
        dto.setReleaseDate(movie.getReleaseDate());
        dto.setDurationInMinutes(movie.getDurationInMinutes());
        dto.setLanguage(movie.getLanguage());
        return dto;
    }

    // Updates an existing Movie entity from a DTO
    public void updateMovieFromDto(CreateMovieRequest request, Movie movie) {
        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setDurationInMinutes(request.getDurationInMinutes());
        movie.setLanguage(request.getLanguage());
    }
}