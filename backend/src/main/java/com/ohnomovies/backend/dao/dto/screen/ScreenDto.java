package com.ohnomovies.backend.dao.dto.screen;

import lombok.Data;

@Data
public class ScreenDto {
    private Long id;
    private String screenName;
    private Integer totalRows;
    private Integer totalColumns;
}
