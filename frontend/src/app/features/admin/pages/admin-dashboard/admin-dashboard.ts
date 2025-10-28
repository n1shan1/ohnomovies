import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AdminMovieService } from '../../services/admin-movie.service';
import { AdminTheaterService } from '../../services/admin-theater.service';
import { AdminShowtimeService } from '../../services/admin-showtime.service';
import { AdminBookingService } from '../../services/admin-booking.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  private movieService = inject(AdminMovieService);
  private theaterService = inject(AdminTheaterService);
  private showtimeService = inject(AdminShowtimeService);
  private bookingService = inject(AdminBookingService);

  stats = {
    movies: 0,
    theaters: 0,
    showtimes: 0,
    bookings: 0,
  };

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      movies: this.movieService.getAllMovies(),
      theaters: this.theaterService.getAllTheaters(),
      showtimes: this.showtimeService.getAllShowtimes(),
      bookings: this.bookingService.getAllBookings(),
    }).subscribe({
      next: (data) => {
        this.stats.movies = data.movies.length;
        this.stats.theaters = data.theaters.length;
        this.stats.showtimes = data.showtimes.length;
        this.stats.bookings = data.bookings.length;
      },
      error: (err) => {
        // Error loading stats - handled silently
      },
    });
  }
}
