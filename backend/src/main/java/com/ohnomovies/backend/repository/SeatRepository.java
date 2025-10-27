package com.ohnomovies.backend.repository;


import com.ohnomovies.backend.model.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByScreenIdOrderBySeatRowAscSeatNumberAsc(Long screenId);
}
