import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService, Movie, Showtime } from '../../services/movie.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate } from '@angular/common';

@Component({
  selector: 'movie-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails implements OnInit {
  movie: Movie | null = null;
  showtimes: Showtime[] = [];
  isLoading: boolean = false;
  movieId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.movieId = +params['id'];
      this.loadMovieDetails();
      this.loadShowtimes();
    });
  }

  loadMovieDetails(): void {
    this.isLoading = true;

    this.movieService.getMovieById(this.movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  loadShowtimes(): void {
    this.movieService.getShowtimesByMovieId(this.movieId).subscribe({
      next: (showtimes) => {
        this.showtimes = showtimes;
      },
      error: () => {},
    });
  }

  bookShowtime(showtimeId: number): void {
    this.router.navigate(['/shows', showtimeId, 'seats']);
  }

  getDurationDisplay(): string {
    if (!this.movie) return '';
    const hours = Math.floor(this.movie.durationInMinutes / 60);
    const minutes = this.movie.durationInMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  formatShowtime(time: string): string {
    try {
      return formatDate(time, 'MMM d, y - h:mm a', 'en-IN');
    } catch {
      return time;
    }
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
