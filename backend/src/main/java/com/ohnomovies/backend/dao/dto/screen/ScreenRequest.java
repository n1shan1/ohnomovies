package com.ohnomovies.backend.dao.dto.screen;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScreenRequest {
    @NotEmpty
    private String screenName;

    @NotNull
    @Min(1)
    private Integer totalRows;

    @NotNull
    @Min(1)
    private Integer totalColumns;
}
