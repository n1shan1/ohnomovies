package com.ohnomovies.backend.dao.dto.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ohnomovies.backend.model.types.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private String paymentIntentId;
    private String clientSecret;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String paymentMethod;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Additional fields for refunds
    private boolean refunded;
    private BigDecimal refundAmount;

    // Error details (if any)
    private String errorMessage;
    private String errorCode;
}