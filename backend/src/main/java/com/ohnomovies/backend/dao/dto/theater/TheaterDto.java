package com.ohnomovies.backend.dao.dto.theater;

import com.ohnomovies.backend.dao.dto.screen.ScreenDto;
import lombok.Data;
import java.util.List;

// This DTO will be used for detailed responses
@Data
public class TheaterDto {
    private Long id;
    private String name;
    private String location;
    private List<ScreenDto> screens;
}