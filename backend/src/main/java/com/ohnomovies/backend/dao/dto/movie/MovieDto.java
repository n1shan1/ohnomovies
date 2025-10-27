package com.ohnomovies.backend.dao.dto.movie;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MovieDto {
    private Long id;
    private String title;
    private String description;
    private String posterUrl;
    private LocalDate releaseDate;
    private Integer durationInMinutes;
    private String language;
}
