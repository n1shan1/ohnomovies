import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ShowtimeSeatDto } from '../../../../core/models/backend-dtos';

@Component({
  selector: 'app-seat-grid',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './seat-grid.component.html',
  styleUrl: './seat-grid.component.css',
})
export class SeatGridComponent implements OnChanges {
  @Input() seats: ShowtimeSeatDto[] = [];
  @Input() maxSelectable: number = 0;
  @Input() disabled: boolean = false;

  @Output() selectedSeatsChange = new EventEmitter<ShowtimeSeatDto[]>();

  selectedSeatsInternal = new Set<number>();
  organizedSeats: { [row: string]: ShowtimeSeatDto[] } = {};
  rows: string[] = [];
  maxColumns: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seats'] && this.seats.length > 0) {
      this.organizeSeatsByRow();
    }
    if (changes['maxSelectable']) {
      if (this.selectedSeatsInternal.size > this.maxSelectable) {
        const seatsArray = Array.from(this.selectedSeatsInternal);
        this.selectedSeatsInternal = new Set(seatsArray.slice(0, this.maxSelectable));
        this.emitSelectedSeats();
      }
    }
  }

  organizeSeatsByRow(): void {
    this.organizedSeats = {};
    this.maxColumns = 0;

    this.seats.forEach((seat) => {
      if (!this.organizedSeats[seat.seatRow]) {
        this.organizedSeats[seat.seatRow] = [];
      }
      this.organizedSeats[seat.seatRow].push(seat);
      this.maxColumns = Math.max(this.maxColumns, seat.seatNumber);
    });

    this.rows = Object.keys(this.organizedSeats).sort();

    this.rows.forEach((row) => {
      this.organizedSeats[row].sort((a, b) => a.seatNumber - b.seatNumber);
    });
  }

  selectSeat(seat: ShowtimeSeatDto): void {
    if (this.disabled || seat.status !== 'AVAILABLE') {
      return;
    }

    if (this.selectedSeatsInternal.has(seat.id)) {
      this.selectedSeatsInternal.delete(seat.id);
    } else {
      if (this.selectedSeatsInternal.size < this.maxSelectable) {
        this.selectedSeatsInternal.add(seat.id);
      } else {
        return;
      }
    }

    this.emitSelectedSeats();
  }

  emitSelectedSeats(): void {
    const selectedSeats = this.seats.filter((seat) => this.selectedSeatsInternal.has(seat.id));
    this.selectedSeatsChange.emit(selectedSeats);
  }

  isSeatSelected(seat: ShowtimeSeatDto): boolean {
    return this.selectedSeatsInternal.has(seat.id);
  }

  getSeatClasses(seat: ShowtimeSeatDto): string {
    const baseClasses =
      'w-10 h-10 md:w-12 md:h-12 rounded-md text-xs md:text-sm flex items-center justify-center font-bold border-2 transition-all duration-200';

    if (this.isSeatSelected(seat)) {
      return `${baseClasses} bg-primary-500 border-primary-700 text-white ring-2 ring-primary-300 ring-offset-1 cursor-pointer shadow-md`;
    }

    switch (seat.status) {
      case 'AVAILABLE':
        if (this.disabled) {
          return `${baseClasses} bg-surface-100 border-surface-300 text-surface-500 cursor-not-allowed opacity-50`;
        }
        return `${baseClasses} bg-surface-100 border-surface-300 text-surface-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 cursor-pointer hover:scale-110 hover:shadow-sm`;
      case 'BOOKED':
        return `${baseClasses} bg-surface-300 border-surface-400 text-surface-500 cursor-not-allowed`;
      case 'LOCKED':
        return `${baseClasses} bg-yellow-400 border-yellow-600 text-yellow-900 cursor-not-allowed`;
      default:
        return baseClasses;
    }
  }

  getSeatTooltip(seat: ShowtimeSeatDto): string {
    switch (seat.status) {
      case 'BOOKED':
        return 'Booked';
      case 'LOCKED':
        return 'Reserved';
      case 'AVAILABLE':
        return `Seat ${seat.seatRow}${seat.seatNumber}`;
      default:
        return '';
    }
  }
}
