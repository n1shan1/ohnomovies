package com.ohnomovies.backend.dao.mapper;


import com.ohnomovies.backend.dao.dto.booking.BookingResponse;
import com.ohnomovies.backend.model.entity.Booking;
import com.ohnomovies.backend.model.entity.Payment;
import com.ohnomovies.backend.model.entity.Showtime;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BookingMapper {
    public BookingResponse toBookingResponse(Booking booking) {
        BookingResponse dto = new BookingResponse();
        dto.setBookingUuid(booking.getBookingUuid());
        dto.setStatus(booking.getBookingStatus());
        dto.setBookedAt(booking.getBookedAt());

        Payment payment = booking.getPayment();
        if (payment != null) {
            dto.setTotalAmount(payment.getAmount());
            dto.setCurrency(payment.getCurrency());
        }

        Showtime showtime = booking.getShowtime();
        if (showtime != null) {
            dto.setStartTime(showtime.getStartTime());
            if (showtime.getMovie() != null) {
                dto.setMovieTitle(showtime.getMovie().getTitle());
            }
            if (showtime.getScreen() != null) {
                dto.setScreenName(showtime.getScreen().getScreenName());
                if(showtime.getScreen().getTheater() != null) {
                    dto.setTheaterName(showtime.getScreen().getTheater().getName());
                }
            }
        }

        if (booking.getBookedSeats() != null) {
            List<String> seatNames = booking.getBookedSeats().stream()
                    .map(seat -> seat.getSeat().getSeatRow() + seat.getSeat().getSeatNumber())
                    .sorted()
                    .collect(Collectors.toList());
            dto.setSeats(seatNames);
        }

        return dto;
    }
}
