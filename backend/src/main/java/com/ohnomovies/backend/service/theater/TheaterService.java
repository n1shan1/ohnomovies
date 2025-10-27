package com.ohnomovies.backend.service.theater;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.ohnomovies.backend.dao.dto.screen.ScreenDto;
import com.ohnomovies.backend.dao.dto.screen.ScreenRequest;
import com.ohnomovies.backend.dao.dto.theater.TheaterDto;
import com.ohnomovies.backend.dao.dto.theater.TheaterRequest;

public interface TheaterService {
    @Transactional
    TheaterDto createTheater(TheaterRequest request);

    @Transactional(readOnly = true)
    List<TheaterDto> getAllTheaters();

    @Transactional(readOnly = true)
    TheaterDto getTheaterById(Long theaterId);

    @Transactional
    TheaterDto updateTheater(Long theaterId, TheaterRequest request);

    @Transactional
    void deleteTheater(Long theaterId);

    @Transactional
    ScreenDto createScreen(Long theaterId, ScreenRequest request);

    @Transactional
    ScreenDto updateScreen(Long screenId, ScreenRequest request);

    @Transactional
    void deleteScreen(Long screenId);

    @Transactional(readOnly = true)
    ScreenDto getScreenById(Long screenId);

    @Transactional(readOnly = true)
    List<ScreenDto> getScreensForTheater(Long theaterId);

    // Helper method to convert row index to letter (A, B... Z, AA, AB...)
    // Excel Column algorithm
    String getRowLetter(int rowIndex);
}
