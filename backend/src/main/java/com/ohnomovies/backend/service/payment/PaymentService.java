package com.ohnomovies.backend.service.payment;

import java.math.BigDecimal;

import com.ohnomovies.backend.dao.dto.payment.PaymentRequest;
import com.ohnomovies.backend.dao.dto.payment.PaymentResponse;
import com.ohnomovies.backend.model.entity.User;

public interface PaymentService {
    /**
     * Process a payment using mocked Stripe-like interface
     * 
     * @param request Payment request with card details and amount
     * @param user    The user making the payment
     * @return Payment response with transaction details
     */
    PaymentResponse processPayment(PaymentRequest request, User user);

    /**
     * Get payment details by payment intent ID
     * 
     * @param paymentIntentId The payment intent ID
     * @return Payment response
     */
    PaymentResponse getPayment(String paymentIntentId);

    /**
     * Refund a payment (mocked)
     * 
     * @param paymentIntentId The payment intent ID to refund
     * @param amount          Amount to refund (null for full refund)
     * @return Refund response
     */
    PaymentResponse refundPayment(String paymentIntentId, BigDecimal amount);
}