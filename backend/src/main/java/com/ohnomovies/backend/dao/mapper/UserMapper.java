package com.ohnomovies.backend.dao.mapper;

import com.ohnomovies.backend.dao.dto.user.UserProfileDto;
import com.ohnomovies.backend.model.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserProfileDto toUserProfileDto(User user) {
        if (user == null) {
            return null;
        }
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        return dto;
    }
}
