package com.ohnomovies.backend.service.user;

import com.ohnomovies.backend.dao.dto.user.UpdateProfileRequest;
import com.ohnomovies.backend.dao.dto.user.UserProfileDto;
import com.ohnomovies.backend.model.entity.User;
import org.springframework.transaction.annotation.Transactional;

public interface UserService {
    @Transactional(readOnly = true)
    UserProfileDto getUserProfile(User user);

    @Transactional
    UserProfileDto updateUserProfile(User user, UpdateProfileRequest request);

    @Transactional
    void deleteUserAccount(User user);
}
