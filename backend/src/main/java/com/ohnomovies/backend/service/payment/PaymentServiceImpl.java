package com.ohnomovies.backend.service.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ohnomovies.backend.dao.dto.payment.PaymentRequest;
import com.ohnomovies.backend.dao.dto.payment.PaymentResponse;
import com.ohnomovies.backend.model.entity.User;
import com.ohnomovies.backend.model.types.PaymentStatus;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    @Override
    public PaymentResponse processPayment(PaymentRequest request, User user) {
        log.info("Processing mocked payment for user {} with amount {}", user.getId(), request.getAmount());

        // Simulate payment processing delay
        try {
            Thread.sleep(1000); // 1 second delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        PaymentResponse response = new PaymentResponse();
        response.setPaymentIntentId("pi_" + UUID.randomUUID().toString().replace("-", ""));
        response.setClientSecret("cs_" + UUID.randomUUID().toString().replace("-", ""));
        response.setAmount(request.getAmount());
        response.setCurrency(request.getCurrency());
        response.setDescription(request.getDescription());
        response.setCreatedAt(LocalDateTime.now());
        response.setUpdatedAt(LocalDateTime.now());

        // Mock payment validation
        boolean isValidCard = validateCardDetails(request);
        if (!isValidCard) {
            response.setStatus(PaymentStatus.FAILED);
            response.setErrorMessage("Invalid card details");
            response.setErrorCode("card_declined");
            log.warn("Payment failed for user {}: Invalid card details", user.getId());
            return response;
        }

        // Always succeed for simplicity
        response.setStatus(PaymentStatus.SUCCESS);
        response.setPaymentMethod("card");
        log.info("Payment successful for user {}: {}", user.getId(), response.getPaymentIntentId());

        return response;
    }

    @Override
    public PaymentResponse getPayment(String paymentIntentId) {
        log.debug("Retrieving payment details for {}", paymentIntentId);

        // In a real implementation, this would fetch from database
        // For mock, return a generic response
        PaymentResponse response = new PaymentResponse();
        response.setPaymentIntentId(paymentIntentId);
        response.setStatus(PaymentStatus.SUCCESS);
        response.setAmount(BigDecimal.valueOf(100.00));
        response.setCurrency("INR");
        response.setPaymentMethod("card");
        response.setCreatedAt(LocalDateTime.now().minusMinutes(5));
        response.setUpdatedAt(LocalDateTime.now().minusMinutes(5));

        return response;
    }

    @Override
    public PaymentResponse refundPayment(String paymentIntentId, BigDecimal amount) {
        log.info("Processing refund for payment {} with amount {}", paymentIntentId, amount);

        // Simulate refund processing
        try {
            Thread.sleep(500); // 0.5 second delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        PaymentResponse response = new PaymentResponse();
        response.setPaymentIntentId(paymentIntentId);
        response.setStatus(PaymentStatus.SUCCESS);
        response.setRefunded(true);
        response.setRefundAmount(amount);
        response.setUpdatedAt(LocalDateTime.now());

        log.info("Refund processed for payment {}", paymentIntentId);
        return response;
    }

    private boolean validateCardDetails(PaymentRequest request) {
        // For demo purposes, make validation more lenient
        String cardNumber = request.getCardNumber().replaceAll("\\s+", "");

        // Basic card number length check (relaxed for demo)
        if (cardNumber.length() < 13 || cardNumber.length() > 19) {
            return false;
        }

        // Basic expiry check (allow current month/year for demo)
        try {
            int currentYear = LocalDateTime.now().getYear() % 100;
            int currentMonth = LocalDateTime.now().getMonthValue();
            int expYear = Integer.parseInt(request.getExpiryYear());
            int expMonth = Integer.parseInt(request.getExpiryMonth());

            // Allow current month/year and future dates
            if (expYear < currentYear || (expYear == currentYear && expMonth < currentMonth)) {
                return false;
            }
        } catch (NumberFormatException e) {
            return false;
        }

        // CVV check (basic length)
        if (request.getCvv().length() < 3 || request.getCvv().length() > 4) {
            return false;
        }

        return true;
    }
}