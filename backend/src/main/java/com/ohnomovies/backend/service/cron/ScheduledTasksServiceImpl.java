package com.ohnomovies.backend.service.cron;

import com.ohnomovies.backend.repository.BookingRepository;
import com.ohnomovies.backend.repository.ShowtimeSeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasksServiceImpl implements ScheduledTasksService {

    private final ShowtimeSeatRepository showtimeSeatRepository;
    private final BookingRepository bookingRepository;

    // Run every minute (fixedRate = 60000 milliseconds)
    @Scheduled(fixedRate = 60000)
    @Transactional
    @Override
    public void unlockExpiredSeats() {
        LocalDateTime now = LocalDateTime.now();
        int unlockedCount = showtimeSeatRepository.unlockExpiredSeats(now);
        if (unlockedCount > 0) {
            log.info("Unlocked {} expired seat locks.", unlockedCount);
        }
    }

    // Run every hour (cron = "0 0 * * * *")
    @Scheduled(cron = "0 */10 * * * ?")
    @Transactional
    @Override
    public void expireOldBookings() {
        LocalDateTime now = LocalDateTime.now();
        int expiredCount = bookingRepository.expireOldBookings(now);
        if (expiredCount > 0) {
            log.info("Marked {} old bookings as EXPIRED.", expiredCount);
        }
    }
}
