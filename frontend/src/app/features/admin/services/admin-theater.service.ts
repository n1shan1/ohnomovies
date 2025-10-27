import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  TheaterDto,
  TheaterRequest,
  ScreenDto,
  ScreenRequest,
} from '../../../core/models/backend-dtos';

@Injectable({
  providedIn: 'root',
})
export class AdminTheaterService {
  private apiService = inject(ApiService);

  getAllTheaters(): Observable<TheaterDto[]> {
    return this.apiService.get<TheaterDto[]>('/admin/theaters');
  }

  getTheaterById(id: number): Observable<TheaterDto> {
    return this.apiService.get<TheaterDto>(`/admin/theaters/${id}`);
  }

  createTheater(data: TheaterRequest): Observable<TheaterDto> {
    return this.apiService.post<TheaterDto>('/admin/theaters', data);
  }

  updateTheater(theaterId: number, data: TheaterRequest): Observable<TheaterDto> {
    return this.apiService.put<TheaterDto>(`/admin/theaters/${theaterId}`, data);
  }

  deleteTheater(theaterId: number): Observable<void> {
    return this.apiService.delete<void>(`/admin/theaters/${theaterId}`);
  }

  // Screen Management
  getScreensForTheater(theaterId: number): Observable<ScreenDto[]> {
    return this.apiService.get<ScreenDto[]>(`/admin/theaters/${theaterId}/screens`);
  }

  getScreenById(screenId: number): Observable<ScreenDto> {
    return this.apiService.get<ScreenDto>(`/admin/theaters/screens/${screenId}`);
  }

  createScreen(theaterId: number, data: ScreenRequest): Observable<ScreenDto> {
    return this.apiService.post<ScreenDto>(`/admin/theaters/${theaterId}/screens`, data);
  }

  updateScreen(screenId: number, data: ScreenRequest): Observable<ScreenDto> {
    return this.apiService.put<ScreenDto>(`/admin/theaters/screens/${screenId}`, data);
  }

  deleteScreen(screenId: number): Observable<void> {
    return this.apiService.delete<void>(`/admin/theaters/screens/${screenId}`);
  }

  getSeatsForScreen(
    screenId: number
  ): Observable<{ id: number; seatRow: string; seatNumber: number }[]> {
    return this.apiService.get<{ id: number; seatRow: string; seatNumber: number }[]>(
      `/admin/screens/${screenId}/seats`
    );
  }
}
