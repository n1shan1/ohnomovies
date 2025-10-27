package com.ohnomovies.backend.repository;

import com.ohnomovies.backend.model.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    // Spring Data JPA provides findAll(), findById(), save(), deleteById(), etc.
}
