import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import {
  ShowtimeSeatDto,
  BookingRequest,
  BookingResponse,
  SeatLockRequest,
} from '../../core/models/backend-dtos';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiService = inject(ApiService);

  /**
   * Get all seats for a showtime with their status
   */
  getShowtimeSeats(showtimeId: number): Observable<ShowtimeSeatDto[]> {
    return this.apiService.get<ShowtimeSeatDto[]>(`/showtimes/${showtimeId}/seats`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * PHASE 1: Lock a single seat
   */
  lockSeat(showtimeSeatId: number): Observable<void> {
    const request: SeatLockRequest = { showtimeSeatId };
    return this.apiService.post<void>('/seats/lock', request).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * PHASE 1: Lock multiple seats sequentially or in parallel
   */
  lockSeats(showtimeSeatIds: number[]): Observable<void[]> {
    if (showtimeSeatIds.length === 0) {
      return throwError(() => new Error('No seats selected'));
    }

    // Create array of lock requests
    const lockRequests: Observable<void>[] = showtimeSeatIds.map((seatId) => this.lockSeat(seatId));

    // Execute all lock requests in parallel
    return forkJoin(lockRequests).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * PHASE 2: Create booking with locked seats
   */
  createBooking(showtimeSeatIds: number[]): Observable<BookingResponse> {
    const request: BookingRequest = { showtimeSeatIds };

    return this.apiService.post<BookingResponse>('/bookings', request).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Get booking by UUID (for ticket page)
   */
  getBookingByUuid(uuid: string): Observable<BookingResponse> {
    return this.apiService.get<BookingResponse>(`/bookings/${uuid}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all bookings for current user
   */
  getMyBookings(): Observable<BookingResponse[]> {
    return this.apiService.get<BookingResponse[]>('/bookings/my-bookings').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Cancel a booking by UUID (not used in user flow, kept for compatibility)
   */
  cancelBooking(uuid: string): Observable<void> {
    return this.apiService.delete<void>(`/bookings/${uuid}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
