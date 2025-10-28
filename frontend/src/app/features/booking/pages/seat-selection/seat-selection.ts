import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BookingService } from '../../services/booking.service';
import { MovieService } from '../../../movies/services/movie.service';
import { ShowtimeSeatDto, ShowtimeDto } from '../../../../core/models/backend-dtos';
import { SeatGridComponent } from '../../components/seat-grid/seat-grid.component';
import { BookingSummaryCardComponent } from '../../components/booking-summary-card/booking-summary-card.component';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    SelectModule,
    ProgressSpinnerModule,
    FormsModule,
    SeatGridComponent,
    BookingSummaryCardComponent,
  ],
  templateUrl: './seat-selection.html',
  styleUrl: './seat-selection.css',
})
export class SeatSelectionComponent implements OnInit {
  showtimeId: number = 0;
  showtime: ShowtimeDto | null = null;
  seats: ShowtimeSeatDto[] = [];
  selectedSeats: ShowtimeSeatDto[] = [];
  selectedSeatCount: number | null = null;
  isLoading: boolean = true;
  isBooking: boolean = false;

  seatCountOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private movieService: MovieService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('showtimeId');
    if (!id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid showtime',
      });
      this.router.navigate(['/movies']);
      return;
    }

    this.showtimeId = parseInt(id, 10);
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // Use forkJoin to fetch both showtime details and seat map concurrently
    forkJoin({
      showtime: this.movieService.getShowtimeById(this.showtimeId),
      seats: this.bookingService.getSeatMap(this.showtimeId),
    }).subscribe({
      next: ({ showtime, seats }) => {
        this.showtime = showtime;
        this.seats = seats;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load showtime details',
        });
        this.isLoading = false;
        // Optionally redirect back
        setTimeout(() => this.router.navigate(['/movies']), 2000);
      },
    });
  }

  onSeatCountChange(): void {
    this.selectedSeats = [];
  }

  onSelectedSeatsChange(seats: ShowtimeSeatDto[]): void {
    this.selectedSeats = seats;
  }

  processBooking(): void {
    if (this.selectedSeats.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select at least one seat',
      });
      return;
    }

    this.isBooking = true;

    const seatIds = this.selectedSeats.map((s) => s.id);

    // PHASE 1: Lock seats
    this.bookingService
      .lockSeats(seatIds)
      .pipe(
        // PHASE 2: Navigate to payment instead of direct booking
        switchMap(() => {
          this.isBooking = false;
          // Calculate total amount
          const totalAmount = this.selectedSeats.length * (this.showtime?.price || 0) + 50; // Add booking fee
          // Navigate to payment page with state
          this.router.navigate(['/booking/payment'], {
            state: {
              showtime: this.showtime,
              selectedSeats: seatIds,
              totalAmount: totalAmount,
            },
          });
          // Also store in localStorage as backup
          localStorage.setItem(
            'paymentData',
            JSON.stringify({
              showtime: this.showtime,
              selectedSeats: seatIds,
              totalAmount: totalAmount,
              timestamp: Date.now(),
            })
          );
          return []; // Return empty observable since we're navigating
        })
      )
      .subscribe({
        next: () => {
          // Navigation handled above
        },
        error: (error) => {
          this.isBooking = false;

          // Handle specific error cases
          if (error.status === 400) {
            // Seat not available error
            this.messageService.add({
              severity: 'error',
              summary: 'Seat Unavailable',
              detail:
                'One or more selected seats are no longer available. Please choose different seats.',
              life: 5000,
            });
            // Refresh the seat map to show current availability
            this.refreshSeatMap();
          } else if (error.status === 409) {
            // Conflict - seats locked by another user
            this.messageService.add({
              severity: 'warn',
              summary: 'Seats Already Locked',
              detail:
                'These seats are temporarily locked by another user. Please select different seats.',
              life: 5000,
            });
            this.refreshSeatMap();
          } else if (error.status === 401) {
            // Unauthorized - session expired
            this.messageService.add({
              severity: 'error',
              summary: 'Session Expired',
              detail: 'Your session has expired. Please log in again.',
              life: 5000,
            });
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            // Generic error
            this.messageService.add({
              severity: 'error',
              summary: 'Booking Failed',
              detail: error.error?.error || 'Unable to complete booking. Please try again.',
              life: 5000,
            });
          }
        },
        complete: () => {
          this.isBooking = false;
        },
      });
  }

  refreshSeatMap(): void {
    this.isLoading = true;
    this.selectedSeats = [];

    this.bookingService.getSeatMap(this.showtimeId).subscribe({
      next: (seats) => {
        this.seats = seats;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/movies', this.showtime?.movieId]);
  }
}
