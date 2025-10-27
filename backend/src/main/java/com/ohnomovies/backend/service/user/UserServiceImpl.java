package com.ohnomovies.backend.service.user;

import com.ohnomovies.backend.dao.dto.user.UpdateProfileRequest;
import com.ohnomovies.backend.dao.dto.user.UserProfileDto;
import com.ohnomovies.backend.dao.mapper.UserMapper;
import com.ohnomovies.backend.exception.ResourceNotFoundException;
import com.ohnomovies.backend.model.entity.User;
import com.ohnomovies.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    @Override
    public UserProfileDto getUserProfile(User user) {
        // The user object comes directly from the security context,
        // so it's guaranteed to be the currently logged-in user.
        return userMapper.toUserProfileDto(user);
    }

    @Transactional
    @Override
    public UserProfileDto updateUserProfile(User user, UpdateProfileRequest request) {
        log.info("Updating profile for user ID: {}", user.getId());
        // Fetch the user again from DB to ensure we have the latest managed entity
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        managedUser.setFirstName(request.getFirstName());
        managedUser.setLastName(request.getLastName());

        User updatedUser = userRepository.save(managedUser);
        log.info("Profile updated successfully for user ID: {}", updatedUser.getId());
        return userMapper.toUserProfileDto(updatedUser);
    }

    @Transactional
    @Override
    public void deleteUserAccount(User user) {
        log.warn("Deleting account for user ID: {}", user.getId());
        // Fetch the managed entity before deleting
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Consider cascading deletes or handling related data (e.g., bookings)
        // For now, we just delete the user. Ensure your DB schema handles cascades appropriately.
        userRepository.delete(managedUser);
        log.info("Account deleted successfully for user ID: {}", user.getId());
    }
}
