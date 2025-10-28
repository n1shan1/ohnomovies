import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminBookingService } from '../../services/admin-booking.service';
import { BookingResponse } from '../../../../core/models/backend-dtos';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './booking-management.html',
  styleUrl: './booking-management.css',
})
export class BookingManagementComponent implements OnInit {
  private bookingService = inject(AdminBookingService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  bookings: BookingResponse[] = [];

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      },
      error: (err) => {
        // Don't show error toast for empty data - handled in template
      },
    });
  }

  verifyBooking(booking: BookingResponse) {
    this.bookingService.verifyBooking(booking.bookingUuid).subscribe({
      next: (response) => {
        if (response.valid) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'Ticket verified successfully',
          });
          this.loadBookings(); // Refresh to show updated status
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Verification Failed',
            detail: response.message || 'Ticket verification failed',
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to verify ticket',
        });
      },
    });
  }

  cancelBooking(booking: BookingResponse) {
    this.confirmationService.confirm({
      message: `Are you sure you want to cancel booking ${booking.bookingUuid}?`,
      header: 'Confirm Cancellation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bookingService.cancelBooking(booking.bookingUuid).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Booking cancelled successfully',
            });
            this.loadBookings();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to cancel booking',
            });
          },
        });
      },
    });
  }

  getStatusSeverity(
    status: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'USED':
        return 'info';
      case 'EXPIRED':
        return 'warn';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getSeatList(booking: BookingResponse): string {
    // seats is already an array of strings like ['A1', 'A2']
    return booking.seats.join(', ');
  }

  canVerify(booking: BookingResponse): boolean {
    return booking.status === 'CONFIRMED';
  }

  canCancel(booking: BookingResponse): boolean {
    return booking.status === 'CONFIRMED' || booking.status === 'USED';
  }
}
