import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ShowtimeDto, ShowtimeRequest } from '../../../core/models/backend-dtos';

@Injectable({
  providedIn: 'root',
})
export class AdminShowtimeService {
  private apiService = inject(ApiService);

  getAllShowtimes(): Observable<ShowtimeDto[]> {
    return this.apiService.get<ShowtimeDto[]>('/admin/showtimes');
  }

  getShowtimeById(id: number): Observable<ShowtimeDto> {
    return this.apiService.get<ShowtimeDto>(`/admin/showtimes/${id}`);
  }

  createShowtime(data: ShowtimeRequest): Observable<ShowtimeDto> {
    return this.apiService.post<ShowtimeDto>('/admin/showtimes', data);
  }

  updateShowtime(id: number, data: ShowtimeRequest): Observable<ShowtimeDto> {
    return this.apiService.put<ShowtimeDto>(`/admin/showtimes/${id}`, data);
  }

  deleteShowtime(id: number): Observable<void> {
    return this.apiService.delete<void>(`/admin/showtimes/${id}`);
  }
}
