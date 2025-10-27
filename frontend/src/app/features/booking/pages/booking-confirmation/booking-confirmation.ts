import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BookingService } from '../../services/booking.service';
import { BookingResponse } from '../../../../core/models/backend-dtos';

@Component({
  selector: 'booking-confirmation',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DividerModule, ProgressSpinnerModule],
  templateUrl: './booking-confirmation.html',
  styleUrl: './booking-confirmation.css',
})
export class BookingConfirmation implements OnInit {
  booking: BookingResponse | null = null;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const bookingUuid = params['id']; // Changed from numeric ID to UUID
      this.loadBooking(bookingUuid);
    });
  }

  loadBooking(bookingUuid: string): void {
    this.isLoading = true;

    this.bookingService.getBookingDetails(bookingUuid).subscribe({
      next: (booking: BookingResponse) => {
        this.booking = booking;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
      },
    });
  }

  downloadPDF(): void {
    // TODO: Implement PDF download functionality
    alert('PDF download feature coming soon!');
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  goToMovies(): void {
    this.router.navigate(['/movies']);
  }
}
