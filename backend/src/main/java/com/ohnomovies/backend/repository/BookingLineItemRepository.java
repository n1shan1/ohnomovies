package com.ohnomovies.backend.repository;


import com.ohnomovies.backend.model.entity.BookingLineItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingLineItemRepository extends JpaRepository<BookingLineItem, Long> {
}
