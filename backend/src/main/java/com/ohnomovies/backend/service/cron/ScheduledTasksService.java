package com.ohnomovies.backend.service.cron;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

public interface ScheduledTasksService {
    // Run every minute (fixedRate = 60000 milliseconds)
    @Scheduled(fixedRate = 60000)
    @Transactional
    void unlockExpiredSeats();

    // Run every hour (cron = "0 0 * * * *")
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    void expireOldBookings();
}
