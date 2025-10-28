import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { BookingService } from '../../services/booking.service';
import { ShowtimeDto } from '../../../../core/models/backend-dtos';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  showtime: ShowtimeDto | null = null;
  selectedSeats: number[] = [];
  totalAmount: number = 0;
  isProcessing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private messageService: MessageService
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^(\d{4}\s){3}\d{4}$/)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardholderName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      ],
    });
  }

  ngOnInit(): void {
    // Get data from route state or query params
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.showtime = navigation.extras.state['showtime'];
      this.selectedSeats = navigation.extras.state['selectedSeats'] || [];
      this.totalAmount = navigation.extras.state['totalAmount'] || 0;
    } else {
      // Fallback to localStorage
      const storedData = localStorage.getItem('paymentData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          // Check if data is not too old (within 30 minutes)
          if (Date.now() - parsedData.timestamp < 30 * 60 * 1000) {
            this.showtime = parsedData.showtime;
            this.selectedSeats = parsedData.selectedSeats || [];
            this.totalAmount = parsedData.totalAmount || 0;
          } else {
            localStorage.removeItem('paymentData');
          }
        } catch (error) {
          localStorage.removeItem('paymentData');
        }
      }
    }

    if (!this.showtime || this.selectedSeats.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Payment data not found. Please start booking again.',
      });
      this.router.navigate(['/movies']);
    }
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s+/g, '');
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,4}', 'g'))?.join(' ') || value;
    }
    this.paymentForm.patchValue({ cardNumber: value });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }

    this.isProcessing = true;

    const paymentData = {
      amount: this.totalAmount,
      currency: 'INR',
      cardNumber: this.paymentForm.value.cardNumber.replace(/\s+/g, ''),
      expiryMonth: this.paymentForm.value.expiryMonth,
      expiryYear: this.paymentForm.value.expiryYear,
      cvv: this.paymentForm.value.cvv,
      cardholderName: this.paymentForm.value.cardholderName,
      description: `Movie tickets for ${this.showtime?.movieTitle}`,
    };

    this.paymentService.processPayment(paymentData).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          this.messageService.add({
            severity: 'success',
            summary: 'Payment Successful',
            detail: 'Processing your booking...',
          });

          // Proceed to booking creation
          this.createBooking();
        } else {
          this.isProcessing = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Payment Failed',
            detail: response.errorMessage || 'Payment was declined. Please try again.',
          });
        }
      },
      error: (error: any) => {
        this.isProcessing = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Payment Error',
          detail: 'Unable to process payment. Please try again.',
        });
      },
    });
  }

  private createBooking(): void {
    // Seats should already be locked from seat selection, so proceed directly to booking creation
    this.bookingService.createBooking(this.selectedSeats).subscribe({
      next: (bookingResponse) => {
        // Now confirm payment and booking
        const confirmData = {
          bookingUuid: bookingResponse.bookingUuid,
          paymentIntentId: 'pi_mock_' + Date.now(), // Mock payment intent ID
          paymentMethod: 'card',
        };

        this.bookingService.confirmPaymentAndBooking(confirmData).subscribe({
          next: () => {
            // Clear stored payment data
            localStorage.removeItem('paymentData');
            this.messageService.add({
              severity: 'success',
              summary: 'Booking Confirmed',
              detail: 'Your booking has been confirmed!',
            });
            this.router.navigate(['/ticket', bookingResponse.bookingUuid]);
          },
          error: (error) => {
            this.isProcessing = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Booking Failed',
              detail:
                'Payment was successful but booking confirmation failed. Please contact support.',
            });
          },
        });
      },
      error: (error) => {
        this.isProcessing = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Booking Creation Failed',
          detail: 'Unable to create booking. Please try again.',
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/booking/seat-selection', this.showtime?.id], {
      state: { showtime: this.showtime },
    });
  }

  get cardNumber() {
    return this.paymentForm.get('cardNumber');
  }

  get expiryMonth() {
    return this.paymentForm.get('expiryMonth');
  }

  get expiryYear() {
    return this.paymentForm.get('expiryYear');
  }

  get cvv() {
    return this.paymentForm.get('cvv');
  }

  get cardholderName() {
    return this.paymentForm.get('cardholderName');
  }
}
