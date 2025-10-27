package com.ohnomovies.backend.repository;


import com.ohnomovies.backend.model.entity.TheaterScreen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterScreenRepository extends JpaRepository<TheaterScreen, Long> {
    List<TheaterScreen> findByTheaterId(Long theaterId);
}
