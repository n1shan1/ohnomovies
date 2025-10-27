import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../features/booking/services/booking.service';
import { BookingResponse } from '../../../core/models/backend-dtos';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'my-bookings',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, TagModule, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  bookings: BookingResponse[] = [];
  isLoading: boolean = false;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;

    this.bookingService.getMyBookings().subscribe({
      next: (bookings: BookingResponse[]) => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load bookings.',
        });
      },
    });
  }

  viewDetails(booking: BookingResponse): void {
    this.router.navigate(['/booking', 'ticket', booking.bookingUuid]);
  }

  cancelBooking(booking: BookingResponse): void {
    // Cancel booking is not implemented in the new service
    // You may need to add this endpoint to the backend and service

    this.messageService.add({
      severity: 'info',
      summary: 'Not Implemented',
      detail: 'Booking cancellation is not yet available.',
    });
  }

  getSeatNumbers(booking: BookingResponse): string {
    // booking.seats is already string[] like ["A1", "A2"]
    return booking.seats.join(', ');
  }

  getStatusSeverity(
    status: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warn';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
