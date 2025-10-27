package com.ohnomovies.backend.service.auth;

import com.ohnomovies.backend.dao.dto.auth.AuthRequest;
import com.ohnomovies.backend.dao.dto.auth.AuthResponse;
import com.ohnomovies.backend.dao.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(AuthRequest request);
}
