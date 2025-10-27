package com.ohnomovies.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ohnomovies.backend.dao.dto.user.UpdateProfileRequest;
import com.ohnomovies.backend.dao.dto.user.UserProfileDto;
import com.ohnomovies.backend.model.entity.User;
import com.ohnomovies.backend.service.user.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users") // Base path for user-related actions
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()") // All methods require authentication
@Tag(name = "User Profile", description = "Endpoints for managing user profiles")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user's profile")
    public ResponseEntity<UserProfileDto> getMyProfile(@AuthenticationPrincipal User user) {
        // @AuthenticationPrincipal injects the User object from the security context
        return ResponseEntity.ok(userService.getUserProfile(user));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user's profile")
    public ResponseEntity<UserProfileDto> updateMyProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(user, request));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Delete current user's account")
    public ResponseEntity<Void> deleteMyAccount(@AuthenticationPrincipal User user) {
        userService.deleteUserAccount(user);
        return ResponseEntity.noContent().build(); // 204 No Content is standard for DELETE
    }
}
