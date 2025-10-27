import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import jsPDF from 'jspdf';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { BookingResponse } from '../../../../core/models/backend-dtos';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    DividerModule,
    ProgressSpinnerModule,
    QRCodeComponent,
  ],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css',
})
export class TicketComponent implements OnInit {
  @ViewChild('ticketContent', { static: false }) ticketContent!: ElementRef;

  booking: BookingResponse | null = null;
  qrData: string | null = null;
  isLoading: boolean = true;
  isDownloading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) {
      console.error('[Ticket] No UUID in route');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid booking reference',
      });
      this.router.navigate(['/my-bookings']);
      return;
    }

    this.loadBooking(uuid);
  }

  loadBooking(uuid: string): void {
    this.isLoading = true;
    this.bookingService.getBookingDetails(uuid).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.qrData = booking.bookingUuid;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[Ticket] Error loading booking:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load booking details',
        });
        this.isLoading = false;
        // Redirect after showing error
        setTimeout(() => this.router.navigate(['/my-bookings']), 2000);
      },
    });
  }

  getSeatNumbers(): string {
    if (!this.booking || !this.booking.seats) return '';
    // seats is already an array of strings like ['A1', 'A2']
    return this.booking.seats.join(', ');
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  getStatusSeverity(): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    if (!this.booking) return 'secondary';
    switch (this.booking.status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'info';
      case 'USED':
        return 'secondary';
      case 'EXPIRED':
        return 'warn';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  async downloadPDF(): Promise<void> {
    if (!this.ticketContent || !this.booking) {
      console.error('[Ticket] Cannot download - missing data');
      return;
    }

    this.isDownloading = true;

    try {
      // Create a simple text-based PDF ticket
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Create a simple text-based ticket instead of rendering HTML
      const y = 20;
      let currentY = y;
      const lineHeight = 10;
      const margin = 20;

      // Title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('OhNoMovies Ticket', margin, currentY);
      currentY += lineHeight * 2;

      // Booking ID
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Booking ID: ${this.booking.bookingUuid}`, margin, currentY);
      currentY += lineHeight;

      // Status
      pdf.text(`Status: ${this.booking.status}`, margin, currentY);
      currentY += lineHeight * 2;

      // Movie Details
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(this.booking.movieTitle, margin, currentY);
      currentY += lineHeight * 1.5;

      // Venue Details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Theater: ${this.booking.theaterName}`, margin, currentY);
      currentY += lineHeight;
      pdf.text(`Screen: ${this.booking.screenName}`, margin, currentY);
      currentY += lineHeight;
      pdf.text(`Showtime: ${this.formatDateTime(this.booking.startTime)}`, margin, currentY);
      currentY += lineHeight * 2;

      // Seats
      pdf.setFont('helvetica', 'bold');
      pdf.text('Seats:', margin, currentY);
      currentY += lineHeight;
      pdf.setFont('helvetica', 'normal');
      pdf.text(this.booking.seats.join(', '), margin, currentY);
      currentY += lineHeight * 2;

      // Total Amount
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(
        `Total: ${this.booking.totalAmount.toLocaleString('en-IN', {
          style: 'currency',
          currency: this.booking.currency,
        })}`,
        margin,
        currentY
      );
      currentY += lineHeight * 2;

      // Booking Date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Booked on: ${this.formatDateTime(this.booking.bookedAt)}`, margin, currentY);
      currentY += lineHeight * 3;

      // QR Code section
      pdf.setFontSize(10);
      pdf.text('Present this QR code at the theater:', margin, currentY);
      currentY += lineHeight;

      // Add QR code if available (requires qrcode canvas)
      if (this.qrData) {
        try {
          const qrElement = document.querySelector('qrcode canvas') as HTMLCanvasElement;
          if (qrElement) {
            const qrImage = qrElement.toDataURL('image/png');
            pdf.addImage(qrImage, 'PNG', margin, currentY, 50, 50);
            currentY += 60;
          }
        } catch (e) {
          console.warn('[Ticket] Could not add QR code to PDF:', e);
          pdf.text(this.booking.bookingUuid, margin, currentY);
          currentY += lineHeight;
        }
      }

      // Footer
      pdf.setFontSize(8);
      pdf.text('Thank you for choosing OhNoMovies!', margin, currentY);
      pdf.text('Please arrive 15 minutes before showtime.', margin, currentY + 5);

      pdf.save(`ohnomovies-ticket-${this.booking.bookingUuid}.pdf`);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Ticket downloaded successfully',
      });
    } catch (error) {
      console.error('[Ticket] PDF download failed:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to download ticket. Please try again.',
      });
    } finally {
      this.isDownloading = false;
    }
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  goToMovies(): void {
    this.router.navigate(['/movies']);
  }
}
