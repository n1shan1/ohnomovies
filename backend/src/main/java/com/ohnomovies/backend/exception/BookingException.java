package com.ohnomovies.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Use 400 Bad Request for general booking logic errors
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BookingException extends RuntimeException {
    public BookingException(String message) {
        super(message);
    }
}