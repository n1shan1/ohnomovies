package com.ohnomovies.backend.dao.dto.payment;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    @DecimalMax(value = "10000.00", message = "Amount cannot exceed 10000.00")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be 3 characters")
    private String currency = "INR";

    // Card details (mocked)
    @NotBlank(message = "Card number is required")
    @Pattern(regexp = "\\d{13,19}", message = "Card number must be 13-19 digits")
    private String cardNumber;

    @NotBlank(message = "Expiry month is required")
    @Pattern(regexp = "(0[1-9]|1[0-2])", message = "Expiry month must be 01-12")
    private String expiryMonth;

    @NotBlank(message = "Expiry year is required")
    @Pattern(regexp = "\\d{2}", message = "Expiry year must be 2 digits")
    private String expiryYear;

    @NotBlank(message = "CVV is required")
    @Pattern(regexp = "\\d{3,4}", message = "CVV must be 3-4 digits")
    private String cvv;

    @NotBlank(message = "Cardholder name is required")
    @Size(min = 2, max = 50, message = "Cardholder name must be 2-50 characters")
    private String cardholderName;

    // Optional metadata
    private String description;
}