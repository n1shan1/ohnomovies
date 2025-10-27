import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ShowtimeSeatDto, ShowtimeDto } from '../../../../core/models/backend-dtos';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-summary-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, DividerModule],
  templateUrl: './booking-summary-card.component.html',
  styleUrl: './booking-summary-card.component.css',
})
export class BookingSummaryCardComponent implements OnChanges, OnInit {
  @Input() selectedSeats: ShowtimeSeatDto[] = [];
  @Input() showtime: ShowtimeDto | null = null;
  @Input() isBooking: boolean = false;

  @Output() confirmSelection = new EventEmitter<void>();

  subtotal: number = 0;
  bookingFee: number = 0;
  totalPrice: number = 0;

  constructor(private bookingService: BookingService) {
    this.bookingFee = this.bookingService.getBookingFee();
  }

  ngOnInit(): void {
    this.calculateTotals();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSeats'] || changes['showtime']) {
      this.calculateTotals();
    }
  }

  calculateTotals(): void {
    if (!this.showtime || this.selectedSeats.length === 0) {
      this.subtotal = 0;
      this.totalPrice = 0;
      return;
    }

    this.subtotal = this.selectedSeats.length * this.showtime.price;
    this.totalPrice = this.subtotal + this.bookingFee;
  }

  onConfirm(): void {
    this.confirmSelection.emit();
  }

  getSeatLabel(seat: ShowtimeSeatDto): string {
    return `${seat.seatRow}${seat.seatNumber}`;
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}
