import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { MovieDto, CreateMovieRequest } from '../../../core/models/backend-dtos';

@Injectable({
  providedIn: 'root',
})
export class AdminMovieService {
  private apiService = inject(ApiService);

  getAllMovies(): Observable<MovieDto[]> {
    return this.apiService.get<MovieDto[]>('/admin/movies');
  }

  getMovieById(id: number): Observable<MovieDto> {
    return this.apiService.get<MovieDto>(`/admin/movies/${id}`);
  }

  createMovie(data: CreateMovieRequest): Observable<MovieDto> {
    return this.apiService.post<MovieDto>('/admin/movies', data);
  }

  updateMovie(id: number, data: CreateMovieRequest): Observable<MovieDto> {
    return this.apiService.put<MovieDto>(`/admin/movies/${id}`, data);
  }

  deleteMovie(id: number): Observable<void> {
    return this.apiService.delete<void>(`/admin/movies/${id}`);
  }
}
