package com.ohnomovies.backend.dao.mapper;

import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;

import com.ohnomovies.backend.dao.dto.screen.ScreenDto;
import com.ohnomovies.backend.dao.dto.screen.ScreenRequest;
import com.ohnomovies.backend.dao.dto.theater.TheaterDto;
import com.ohnomovies.backend.dao.dto.theater.TheaterRequest;
import com.ohnomovies.backend.model.entity.Theater;
import com.ohnomovies.backend.model.entity.TheaterScreen;

@Component
public class TheaterMapper {

    // --- Theater Mappings ---

    public Theater toTheater(TheaterRequest request) {
        Theater theater = new Theater();
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        return theater;
    }

    public void updateTheaterFromDto(TheaterRequest request, Theater theater) {
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
    }

    public TheaterDto toTheaterDto(Theater theater) {
        TheaterDto dto = new TheaterDto();
        dto.setId(theater.getId());
        dto.setName(theater.getName());
        dto.setLocation(theater.getLocation());

        // Map the screens if they are loaded and initialized
        if (Hibernate.isInitialized(theater.getScreens()) && theater.getScreens() != null) {
            dto.setScreens(
                    theater.getScreens().stream()
                            .map(this::toScreenDto)
                            .collect(Collectors.toList()));
        }
        return dto;
    }

    // --- Screen Mappings ---

    public TheaterScreen toScreen(ScreenRequest request) {
        TheaterScreen screen = new TheaterScreen();
        screen.setScreenName(request.getScreenName());
        screen.setTotalRows(request.getTotalRows());
        screen.setTotalColumns(request.getTotalColumns());
        return screen;
    }

    public ScreenDto toScreenDto(TheaterScreen screen) {
        ScreenDto dto = new ScreenDto();
        dto.setId(screen.getId());
        dto.setScreenName(screen.getScreenName());
        dto.setTotalRows(screen.getTotalRows());
        dto.setTotalColumns(screen.getTotalColumns());
        return dto;
    }
}
