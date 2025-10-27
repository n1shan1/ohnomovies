package com.ohnomovies.backend.service.movie;

import com.ohnomovies.backend.dao.dto.movie.CreateMovieRequest;
import com.ohnomovies.backend.dao.dto.movie.MovieDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MovieService {
    @Transactional(readOnly = true)
    List<MovieDto> getAllMovies();

    @Transactional(readOnly = true)
    MovieDto getMovieById(Long movieId);

    @Transactional
    MovieDto createMovie(CreateMovieRequest request);

    @Transactional
    MovieDto updateMovie(Long movieId, CreateMovieRequest request);

    @Transactional
    void deleteMovie(Long movieId);
}
