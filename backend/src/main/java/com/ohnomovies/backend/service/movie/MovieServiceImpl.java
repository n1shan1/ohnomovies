package com.ohnomovies.backend.service.movie;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ohnomovies.backend.dao.dto.movie.CreateMovieRequest;
import com.ohnomovies.backend.dao.dto.movie.MovieDto;
import com.ohnomovies.backend.dao.mapper.MovieMapper;
import com.ohnomovies.backend.exception.ResourceNotFoundException;
import com.ohnomovies.backend.model.entity.Movie;
import com.ohnomovies.backend.repository.MovieRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    @Transactional(readOnly = true)
    @Override
    public List<MovieDto> getAllMovies() {
        return movieRepository.findAll()
                .stream()
                .map(movieMapper::toMovieDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public MovieDto getMovieById(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + movieId));
        return movieMapper.toMovieDto(movie);
    }

    @Transactional
    @Override
    public MovieDto createMovie(CreateMovieRequest request) {
        Movie movie = movieMapper.toMovie(request);
        Movie savedMovie = movieRepository.save(movie);
        return movieMapper.toMovieDto(savedMovie);
    }

    @Transactional
    @Override
    public MovieDto updateMovie(Long movieId, CreateMovieRequest request) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + movieId));
        movieMapper.updateMovieFromDto(request, movie);
        Movie updatedMovie = movieRepository.save(movie);
        return movieMapper.toMovieDto(updatedMovie);
    }

    @Transactional
    @Override
    public void deleteMovie(Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new ResourceNotFoundException("Movie not found with id: " + movieId);
        }
        movieRepository.deleteById(movieId);
    }
}
