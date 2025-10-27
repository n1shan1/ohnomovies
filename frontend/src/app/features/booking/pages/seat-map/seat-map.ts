import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { ShowtimeSeatDto, BookingResponse } from '../../../../core/models/backend-dtos';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'seat-map',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, DividerModule, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './seat-map.html',
  styleUrl: './seat-map.css',
})
export class SeatMap implements OnInit {
  seats: ShowtimeSeatDto[] = [];
  selectedSeats: ShowtimeSeatDto[] = [];
  showtimeId: number = 0;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  // Organized seats by row for display
  seatsByRow: Map<string, ShowtimeSeatDto[]> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.showtimeId = +params['showtimeId'];
      this.loadSeats();
    });
  }

  loadSeats(): void {
    this.isLoading = true;

    this.bookingService.getSeatMap(this.showtimeId).subscribe({
      next: (seats: ShowtimeSeatDto[]) => {
        this.seats = seats;
        this.organizeSeatsByRow();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load seats. Please try again.',
        });
      },
    });
  }

  organizeSeatsByRow(): void {
    this.seatsByRow.clear();
    this.seats.forEach((seat) => {
      if (!this.seatsByRow.has(seat.seatRow)) {
        this.seatsByRow.set(seat.seatRow, []);
      }
      this.seatsByRow.get(seat.seatRow)!.push(seat);
    });

    // Sort seats by seat number within each row
    this.seatsByRow.forEach((row) => {
      row.sort((a, b) => a.seatNumber - b.seatNumber);
    });
  }

  getRows(): string[] {
    return Array.from(this.seatsByRow.keys()).sort();
  }

  toggleSeat(seat: ShowtimeSeatDto): void {
    if (seat.status !== 'AVAILABLE') {
      return;
    }

    const index = this.selectedSeats.findIndex((s) => s.id === seat.id);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  isSeatSelected(seat: ShowtimeSeatDto): boolean {
    return this.selectedSeats.some((s) => s.id === seat.id);
  }

  getSeatClass(seat: ShowtimeSeatDto): string {
    if (seat.status === 'BOOKED') {
      return 'seat-booked';
    }
    if (seat.status === 'LOCKED') {
      return 'seat-locked';
    }
    if (this.isSeatSelected(seat)) {
      return 'seat-selected';
    }
    if (seat.status === 'AVAILABLE') {
      return 'seat-available';
    }
    return 'seat-unavailable';
  }

  getTotalAmount(): number {
    // Since ShowtimeSeatDto doesn't have price, we need to get it from showtime
    // For now, returning 0 - should be calculated based on showtime price
    return this.selectedSeats.length * 10; // Placeholder: $10 per seat
  }

  proceedToBooking(): void {
    if (this.selectedSeats.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No seats selected',
        detail: 'Please select at least one seat to proceed.',
      });
      return;
    }

    this.isSubmitting = true;

    const seatIds = this.selectedSeats.map((s) => s.id);

    // Two-phase booking: Lock seats first, then create booking
    this.bookingService
      .lockSeats(seatIds)
      .pipe(switchMap(() => this.bookingService.createBooking(seatIds)))
      .subscribe({
        next: (booking: BookingResponse) => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Booking successful!',
            detail: 'Your seats have been booked.',
          });
          this.router.navigate(['/booking', 'ticket', booking.bookingUuid]);
        },
        error: (err: any) => {
          this.isSubmitting = false;

          if (err.status === 409) {
            this.messageService.add({
              severity: 'error',
              summary: 'Seats unavailable',
              detail: 'Some seats are no longer available. Please select different seats.',
            });
            this.loadSeats(); // Refresh seat map
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Booking failed',
              detail: 'Unable to complete booking. Please try again.',
            });
          }
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
