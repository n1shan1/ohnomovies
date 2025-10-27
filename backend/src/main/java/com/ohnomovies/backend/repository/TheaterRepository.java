package com.ohnomovies.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ohnomovies.backend.model.entity.Theater;

@Repository
public interface TheaterRepository extends JpaRepository<Theater, Long> {

    @Query("SELECT t FROM Theater t LEFT JOIN FETCH t.screens WHERE t.id = :id")
    Theater findByIdWithScreens(@Param("id") Long id);

    @Query("SELECT DISTINCT t FROM Theater t LEFT JOIN FETCH t.screens")
    List<Theater> findAllWithScreens();
}
