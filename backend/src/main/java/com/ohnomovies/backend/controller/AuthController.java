package com.ohnomovies.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.auth.AuthRequest;
import com.ohnomovies.backend.dao.dto.auth.AuthResponse;
import com.ohnomovies.backend.dao.dto.auth.RegisterRequest;
import com.ohnomovies.backend.service.auth.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication including registration and login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request);

        // Set HttpOnly cookie for JWT token
        Cookie jwtCookie = new Cookie("jwt_token", authResponse.getToken());
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // Set to false for local development (HTTP)
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(3600); // 1 hour
        response.addCookie(jwtCookie);

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);

        // Set HttpOnly cookie for JWT token
        Cookie jwtCookie = new Cookie("jwt_token", authResponse.getToken());
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // Set to false for local development (HTTP)
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(3600); // 1 hour
        response.addCookie(jwtCookie);

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Clear the JWT cookie
        Cookie jwtCookie = new Cookie("jwt_token", "");
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // Set to false for local development (HTTP)
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Expire immediately
        response.addCookie(jwtCookie);

        return ResponseEntity.ok().build();
    }
}
