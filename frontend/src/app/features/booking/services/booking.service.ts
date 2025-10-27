import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import {
  ShowtimeDto,
  ShowtimeSeatDto,
  SeatLockRequest,
  BookingRequest,
  BookingResponse,
} from '../../../core/models/backend-dtos';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly BOOKING_FEE = 25; // ₹25 convenience fee per booking

  constructor(private apiService: ApiService) {}

  // Fetch showtime details (price, movie, etc.)
  getShowtimeDetails(showtimeId: number): Observable<ShowtimeDto> {
    return this.apiService.get<ShowtimeDto>(`/showtimes/${showtimeId}`);
  }

  // Fetch the seat map for a showtime
  getSeatMap(showtimeId: number): Observable<ShowtimeSeatDto[]> {
    return this.apiService.get<ShowtimeSeatDto[]>(`/showtimes/${showtimeId}/seats`);
  }

  // Phase 1: Lock selected seats concurrently
  lockSeats(seatIds: number[]): Observable<void[]> {
    const lockRequests: Observable<void>[] = seatIds.map((id) =>
      this.apiService.post<void>('/seats/lock', { showtimeSeatId: id } as SeatLockRequest)
    );
    // forkJoin executes all observables in parallel and waits for all to complete
    return forkJoin(lockRequests);
  }

  // Phase 2: Create the booking using the locked seat IDs
  createBooking(lockedSeatIds: number[]): Observable<BookingResponse> {
    const request: BookingRequest = { showtimeSeatIds: lockedSeatIds };
    return this.apiService.post<BookingResponse>('/bookings', request);
  }

  // Fetch booking details using the UUID for the ticket page
  getBookingDetails(uuid: string): Observable<BookingResponse> {
    return this.apiService.get<BookingResponse>(`/bookings/${uuid}`);
  }

  // Get user's bookings
  getMyBookings(): Observable<BookingResponse[]> {
    return this.apiService.get<BookingResponse[]>('/bookings/my-bookings');
  }

  // Calculate total price (helper method)
  calculateTotalPrice(selectedSeatsCount: number, ticketPrice: number): number {
    if (selectedSeatsCount <= 0 || !ticketPrice) return 0;
    const subtotal = selectedSeatsCount * ticketPrice;
    return subtotal + this.BOOKING_FEE;
  }

  // Get booking fee
  getBookingFee(): number {
    return this.BOOKING_FEE;
  }
}
