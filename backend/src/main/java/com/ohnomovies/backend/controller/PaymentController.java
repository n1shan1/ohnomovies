package com.ohnomovies.backend.controller;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.payment.PaymentRequest;
import com.ohnomovies.backend.dao.dto.payment.PaymentResponse;
import com.ohnomovies.backend.model.entity.User;
import com.ohnomovies.backend.service.booking.BookingService;
import com.ohnomovies.backend.service.payment.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingService bookingService;

    /**
     * Process a payment (Stripe-like payment intent creation)
     */
    @PostMapping("/process")
    public ResponseEntity<PaymentResponse> processPayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal User user) {

        log.info("Processing payment request for user {}", user.getId());

        PaymentResponse response = paymentService.processPayment(request, user);

        if (response.getStatus() == com.ohnomovies.backend.model.types.PaymentStatus.SUCCESS) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get payment details by payment intent ID
     */
    @GetMapping("/{paymentIntentId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable String paymentIntentId) {
        log.debug("Retrieving payment {}", paymentIntentId);

        PaymentResponse response = paymentService.getPayment(paymentIntentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Refund a payment
     */
    @PostMapping("/{paymentIntentId}/refund")
    public ResponseEntity<PaymentResponse> refundPayment(
            @PathVariable String paymentIntentId,
            @RequestBody(required = false) RefundRequest refundRequest) {

        log.info("Processing refund for payment {}", paymentIntentId);

        BigDecimal amount = refundRequest != null ? refundRequest.getAmount() : null;
        PaymentResponse response = paymentService.refundPayment(paymentIntentId, amount);

        return ResponseEntity.ok(response);
    }

    /**
     * Confirm payment and complete booking
     */
    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPaymentAndBooking(
            @RequestBody ConfirmPaymentRequest request,
            @AuthenticationPrincipal User user) {

        log.info("Confirming payment and booking for user {}", user.getId());

        try {
            bookingService.confirmPaymentAndBooking(
                    request.getBookingUuid(),
                    request.getPaymentIntentId(),
                    request.getPaymentMethod());
            return ResponseEntity.ok("Booking confirmed successfully");
        } catch (Exception e) {
            log.error("Failed to confirm payment and booking for UUID: {}, Error: {}", request.getBookingUuid(),
                    e.getMessage(), e);
            return ResponseEntity.badRequest().body("Failed to confirm booking: " + e.getMessage());
        }
    }

    // Inner class for refund request
    public static class RefundRequest {
        private java.math.BigDecimal amount;

        public java.math.BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(java.math.BigDecimal amount) {
            this.amount = amount;
        }
    }

    // Inner class for confirm payment request
    public static class ConfirmPaymentRequest {
        private String bookingUuid;
        private String paymentIntentId;
        private String paymentMethod;

        public java.util.UUID getBookingUuid() {
            try {
                return java.util.UUID.fromString(bookingUuid);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid booking UUID format: " + bookingUuid);
            }
        }

        public void setBookingUuid(String bookingUuid) {
            this.bookingUuid = bookingUuid;
        }

        public String getPaymentIntentId() {
            return paymentIntentId;
        }

        public void setPaymentIntentId(String paymentIntentId) {
            this.paymentIntentId = paymentIntentId;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
    }
}