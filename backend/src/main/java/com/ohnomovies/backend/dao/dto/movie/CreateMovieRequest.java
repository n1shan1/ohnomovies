package com.ohnomovies.backend.dao.dto.movie;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class CreateMovieRequest {
    @NotEmpty
    @Size(min = 2, max = 255)
    private String title;

    @NotEmpty
    private String description;

    @NotEmpty
    private String posterUrl;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate releaseDate;

    @NotNull
    @Min(1)
    private Integer durationInMinutes;

    private String language;
}
