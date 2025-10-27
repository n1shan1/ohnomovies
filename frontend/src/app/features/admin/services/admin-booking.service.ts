import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  BookingResponse,
  BookingVerificationRequest,
  BookingVerificationResponse,
} from '../../../core/models/backend-dtos';

@Injectable({
  providedIn: 'root',
})
export class AdminBookingService {
  private apiService = inject(ApiService);

  getAllBookings(): Observable<BookingResponse[]> {
    return this.apiService.get<BookingResponse[]>('/admin/bookings');
  }

  getBookingByUuid(uuid: string): Observable<BookingResponse> {
    return this.apiService.get<BookingResponse>(`/admin/bookings/${uuid}`);
  }

  verifyBooking(uuid: string): Observable<BookingVerificationResponse> {
    const request: BookingVerificationRequest = { bookingUuid: uuid };
    return this.apiService.post<BookingVerificationResponse>('/admin/bookings/verify', request);
  }

  cancelBooking(uuid: string): Observable<void> {
    return this.apiService.delete<void>(`/admin/bookings/${uuid}`);
  }
}
