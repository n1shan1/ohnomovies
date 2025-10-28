package com.ohnomovies.backend.service.booking;

import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;

import com.ohnomovies.backend.dao.dto.booking.BookingRequest;
import com.ohnomovies.backend.dao.dto.booking.BookingResponse;
import com.ohnomovies.backend.dao.dto.booking.BookingVerificationResponse;
import com.ohnomovies.backend.model.entity.User;

public interface BookingService {
    @Transactional
    void lockSeat(Long showtimeSeatId, User user);

    @Transactional
    BookingResponse createBooking(BookingRequest request, User user);

    @Transactional(readOnly = true)
    List<BookingResponse> getMyBookings(User user);

    @Transactional(readOnly = true)
    BookingResponse getUserBookingByUuid(UUID uuid, User user);

    @Transactional(readOnly = true)
    List<BookingResponse> getAllBookings();

    @Transactional(readOnly = true)
    BookingResponse getBookingByUuid(UUID uuid);

    @Transactional
    BookingVerificationResponse verifyBooking(UUID uuid);

    @Transactional
    void confirmPaymentAndBooking(UUID bookingUuid, String paymentIntentId, String paymentMethod);

    @Transactional
    void cancelBooking(UUID uuid);
}
