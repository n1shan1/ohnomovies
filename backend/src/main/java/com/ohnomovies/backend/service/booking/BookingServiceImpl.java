package com.ohnomovies.backend.service.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Add logging

import com.ohnomovies.backend.dao.dto.booking.BookingRequest;
import com.ohnomovies.backend.dao.dto.booking.BookingResponse;
import com.ohnomovies.backend.dao.dto.booking.BookingVerificationResponse;
import com.ohnomovies.backend.dao.mapper.BookingMapper;
import com.ohnomovies.backend.exception.BookingException;
import com.ohnomovies.backend.exception.ResourceNotFoundException;
import com.ohnomovies.backend.model.entity.Booking;
import com.ohnomovies.backend.model.entity.BookingLineItem;
import com.ohnomovies.backend.model.entity.Payment;
import com.ohnomovies.backend.model.entity.Showtime;
import com.ohnomovies.backend.model.entity.ShowtimeSeat;
import com.ohnomovies.backend.model.entity.User;
import com.ohnomovies.backend.model.types.BookingStatus;
import com.ohnomovies.backend.model.types.Currency;
import com.ohnomovies.backend.model.types.LineItemType;
import com.ohnomovies.backend.model.types.PaymentStatus;
import com.ohnomovies.backend.model.types.ShowtimeSeatStatus;
import com.ohnomovies.backend.repository.BookingLineItemRepository;
import com.ohnomovies.backend.repository.BookingRepository;
import com.ohnomovies.backend.repository.PaymentRepository;
import com.ohnomovies.backend.repository.ShowtimeRepository;
import com.ohnomovies.backend.repository.ShowtimeSeatRepository;

import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j // Add logging
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeSeatRepository showtimeSeatRepository;
    private final PaymentRepository paymentRepository; // Used via cascade
    private final BookingLineItemRepository lineItemRepository; // Used via cascade
    private final BookingMapper bookingMapper;
    // private final EmailService emailService; // Inject when EmailService is ready

    private static final long SEAT_LOCK_DURATION_MINUTES = 10;
    private static final BigDecimal BOOKING_FEE = new BigDecimal("50.00");

    /**
     * Phase 1: Lock a seat for a user (Optimistic Lock)
     */
    @Transactional
    @Override
    public void lockSeat(Long showtimeSeatId, User user) {
        log.info("Attempting to lock seat {} for user {}", showtimeSeatId, user.getId());

        // Use findAvailableSeatById for atomic check
        ShowtimeSeat seat = showtimeSeatRepository.findAvailableSeatById(showtimeSeatId)
                .orElseThrow(() -> new BookingException("Seat is not available or does not exist"));

        seat.setStatus(ShowtimeSeatStatus.LOCKED);
        seat.setLockedByUserId(user.getId());
        seat.setLockExpiresAt(LocalDateTime.now().plusMinutes(SEAT_LOCK_DURATION_MINUTES));

        try {
            showtimeSeatRepository.saveAndFlush(seat); // saveAndFlush forces version check immediately
            log.info("Successfully locked seat {} for user {}", showtimeSeatId, user.getId());
        } catch (OptimisticLockException ex) {
            log.warn("Optimistic lock failed for seat {} and user {}", showtimeSeatId, user.getId());
            throw new BookingException("Seat was just locked by another user. Please try again.");
        } catch (Exception e) {
            log.error("Error locking seat {} for user {}: {}", showtimeSeatId, user.getId(), e.getMessage());
            throw new BookingException("Could not lock the seat due to an unexpected error.");
        }
    }

    /**
     * Phase 2: Confirm the booking from locked seats
     */
    @Transactional
    @Override
    public BookingResponse createBooking(BookingRequest request, User user) {
        log.info("Attempting to create booking for user {} with seats {}", user.getId(), request.getShowtimeSeatIds());

        List<ShowtimeSeat> lockedSeats = showtimeSeatRepository.findByIdInAndStatusAndLockedByUserId(
                request.getShowtimeSeatIds(), ShowtimeSeatStatus.LOCKED, user.getId());

        // Validation
        if (lockedSeats.isEmpty()) {
            log.warn("No valid locked seats found for user {} and request {}", user.getId(),
                    request.getShowtimeSeatIds());
            throw new BookingException("No valid locked seats found. Your session may have expired.");
        }
        if (lockedSeats.size() != request.getShowtimeSeatIds().size()) {
            log.warn("Mismatch in locked seats for user {}. Expected {}, found {}", user.getId(),
                    request.getShowtimeSeatIds().size(), lockedSeats.size());
            throw new BookingException("Some seats were not locked or do not belong to you.");
        }

        Showtime showtime = lockedSeats.get(0).getShowtime(); // All seats must be for the same showtime
        if (showtime == null) {
            throw new BookingException("Showtime not found for the selected seats.");
        }

        // --- 1. Create Booking & Payment ---
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setBookingStatus(BookingStatus.PENDING); // Start as PENDING

        Set<BookingLineItem> lineItems = new HashSet<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // --- 2. Create Line Items ---
        for (ShowtimeSeat seat : lockedSeats) {
            BookingLineItem item = new BookingLineItem();
            item.setDescription("Ticket: " + seat.getSeat().getSeatRow() + seat.getSeat().getSeatNumber());
            item.setAmount(showtime.getPrice());
            item.setLineItemType(LineItemType.SEAT);
            booking.addLineItem(item); // Use convenience method
            totalAmount = totalAmount.add(showtime.getPrice());
        }
        // Add booking fee
        BookingLineItem fee = new BookingLineItem();
        fee.setDescription("Online Booking Fee");
        fee.setAmount(BOOKING_FEE);
        fee.setLineItemType(LineItemType.BOOKING_FEE);
        booking.addLineItem(fee);
        totalAmount = totalAmount.add(BOOKING_FEE);

        // --- 3. Create Payment (will be processed separately via payment service)
        Payment payment = new Payment();
        // Link payment to booking (bidirectional)
        payment.setBooking(booking);
        booking.setPayment(payment);

        payment.setAmount(totalAmount);
        payment.setCurrency(Currency.INR); // Default currency
        payment.setPaymentGatewayId("PENDING_" + UUID.randomUUID().toString()); // Will be updated after payment
        payment.setStatus(PaymentStatus.PENDING); // Start as PENDING, will be updated after payment
        payment.setPaymentMethod("pending");

        // --- 5. Save Booking (cascades to Payment and LineItems) ---
        Booking savedBooking = bookingRepository.save(booking);

        // --- 6. Update Seat Statuses ---
        for (ShowtimeSeat seat : lockedSeats) {
            seat.setStatus(ShowtimeSeatStatus.BOOKED);
            seat.setBooking(savedBooking); // Link seat to the saved booking
            seat.setLockedByUserId(null);
            seat.setLockExpiresAt(null);
        }
        showtimeSeatRepository.saveAll(lockedSeats);

        // --- 7. Send Email (Async - Placeholder) ---
        // emailService.sendBookingConfirmation(savedBooking);
        log.info("Booking {} confirmed successfully for user {}", savedBooking.getBookingUuid(), user.getId());

        return bookingMapper.toBookingResponse(savedBooking);
    }

    // --- User Methods ---
    @Transactional(readOnly = true)
    @Override
    public List<BookingResponse> getMyBookings(User user) {
        log.debug("Fetching bookings for user {}", user.getId());
        return bookingRepository.findByUserIdOrderByBookedAtDesc(user.getId())
                .stream()
                .map(bookingMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public BookingResponse getUserBookingByUuid(UUID uuid, User user) {
        log.debug("Fetching booking {} for user {}", uuid, user.getId());
        Booking booking = bookingRepository.findByBookingUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with UUID: " + uuid));

        // Verify the booking belongs to the user
        if (!booking.getUser().getId().equals(user.getId())) {
            log.warn("User {} attempted to access booking {} owned by user {}",
                    user.getId(), uuid, booking.getUser().getId());
            throw new ResourceNotFoundException("Booking not found with UUID: " + uuid);
        }

        return bookingMapper.toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    @Override
    public List<BookingResponse> getAllBookings() {
        log.debug("Fetching all bookings for admin");
        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public BookingResponse getBookingByUuid(UUID uuid) {
        log.debug("Fetching booking by UUID {}", uuid);
        Booking booking = bookingRepository.findByBookingUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with UUID: " + uuid));
        return bookingMapper.toBookingResponse(booking);
    }

    @Transactional
    @Override
    public BookingVerificationResponse verifyBooking(UUID uuid) {
        log.info("Verifying booking UUID {}", uuid);
        Booking booking = bookingRepository.findByBookingUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with UUID: " + uuid));

        String message;
        boolean valid = false;

        switch (booking.getBookingStatus()) {
            case CONFIRMED:
                // Check if showtime has started or is about to start
                if (booking.getShowtime().getStartTime().isBefore(LocalDateTime.now().plusHours(1))) {
                    booking.setBookingStatus(BookingStatus.USED);
                    bookingRepository.save(booking);
                    message = "Check-in successful.";
                    valid = true;
                    log.info("Booking {} marked as USED", uuid);
                } else {
                    message = "Too early to check in for this showtime.";
                    log.warn("Attempted early check-in for booking {}", uuid);
                }
                break;
            case USED:
                message = "This ticket has already been used.";
                log.warn("Attempted re-use of booking {}", uuid);
                break;
            case CANCELLED:
                message = "This booking has been cancelled.";
                log.warn("Attempted check-in for cancelled booking {}", uuid);
                break;
            case EXPIRED:
                message = "This booking has expired.";
                log.warn("Attempted check-in for expired booking {}", uuid);
                break;
            case PENDING:
                message = "This booking is still pending payment.";
                log.warn("Attempted check-in for pending booking {}", uuid);
                break;
            default:
                message = "Unknown booking status.";
                log.error("Unknown status for booking {}", uuid);
        }

        return new BookingVerificationResponse(valid, message, bookingMapper.toBookingResponse(booking));
    }

    @Transactional
    @Override
    public void cancelBooking(UUID uuid) {
        log.info("Cancelling booking UUID {}", uuid);
        Booking booking = bookingRepository.findByBookingUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with UUID: " + uuid));

        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
            // Only confirmed bookings can be cancelled (add time check if needed)
            booking.setBookingStatus(BookingStatus.CANCELLED);

            // Make seats available again
            for (ShowtimeSeat seat : booking.getBookedSeats()) {
                seat.setStatus(ShowtimeSeatStatus.AVAILABLE);
                seat.setBooking(null); // Unlink from booking
            }
            showtimeSeatRepository.saveAll(booking.getBookedSeats());
            bookingRepository.save(booking);

            // TODO: Add refund logic if using a real payment gateway
            log.info("Booking {} successfully cancelled", uuid);

        } else {
            log.warn("Attempted to cancel booking {} with status {}", uuid, booking.getBookingStatus());
            throw new BookingException("Only confirmed bookings can be cancelled.");
        }
    }

    @Transactional
    @Override
    public void confirmPaymentAndBooking(UUID bookingUuid, String paymentIntentId, String paymentMethod) {
        log.info("Confirming payment and booking for UUID {}", bookingUuid);

        Booking booking = bookingRepository.findByBookingUuid(bookingUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with UUID: " + bookingUuid));

        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            log.warn("Attempted to confirm booking {} with status {}", bookingUuid, booking.getBookingStatus());
            throw new BookingException("Booking is not in pending state");
        }

        // Update payment details
        Payment payment = booking.getPayment();
        payment.setPaymentGatewayId(paymentIntentId);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentMethod(paymentMethod);
        payment.setUpdatedAt(LocalDateTime.now());

        // Confirm booking
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        // Update seat statuses (they should already be BOOKED from initial creation)
        for (ShowtimeSeat seat : booking.getBookedSeats()) {
            if (seat.getStatus() != ShowtimeSeatStatus.BOOKED) {
                seat.setStatus(ShowtimeSeatStatus.BOOKED);
            }
        }
        showtimeSeatRepository.saveAll(booking.getBookedSeats());

        bookingRepository.save(booking);

        log.info("Payment and booking confirmed for UUID {}", bookingUuid);
    }
}