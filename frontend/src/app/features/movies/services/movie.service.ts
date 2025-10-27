import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';

export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  releaseDate: string; // YYYY-MM-DD
  durationInMinutes: number;
  language: string;
}

export interface Theater {
  id: number;
  name: string;
  location: string;
}

export interface Showtime {
  id: number;
  startTime: string; // ISO 8601 datetime
  endTime: string; // ISO 8601 datetime
  price: number;
  movieId: number;
  movieTitle: string;
  screenId: number;
  screenName: string;
  theaterId: number;
  theaterName: string;
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private apiService: ApiService) {}

  getAllMovies(): Observable<Movie[]> {
    return this.apiService.get<Movie[]>('/movies').pipe(
      tap({
        error: (error) => {
          console.error('[MovieService] getAllMovies error', {
            status: error.status,
            message: error.message,
            error: error.error,
          });
        },
      })
    );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.apiService.get<Movie>(`/movies/${id}`);
  }

  getShowtimesByMovieId(movieId: number): Observable<Showtime[]> {
    return this.apiService.get<Showtime[]>(`/movies/${movieId}/showtimes`);
  }

  // Theaters
  getAllTheaters(): Observable<Theater[]> {
    return this.apiService.get<Theater[]>('/theaters');
  }

  getTheaterById(id: number): Observable<Theater> {
    return this.apiService.get<Theater>(`/theaters/${id}`);
  }

  getShowtimesByTheaterId(theaterId: number): Observable<Showtime[]> {
    return this.apiService.get<Showtime[]>(`/theaters/${theaterId}/showtimes`);
  }

  // Showtimes
  getShowtimeById(id: number): Observable<Showtime> {
    return this.apiService.get<Showtime>(`/showtimes/${id}`);
  }
}
