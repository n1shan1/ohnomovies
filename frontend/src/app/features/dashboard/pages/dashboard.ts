import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { Observable } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { BookingService } from '../../../shared/services/booking.service';
import { BookingResponse } from '../../../core/models/backend-dtos';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, TagModule, SkeletonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  currentUser$: Observable<User | null>;
  recentBookings: BookingResponse[] = [];
  isLoadingBookings: boolean = false;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadRecentBookings();
  }

  loadRecentBookings(): void {
    this.isLoadingBookings = true;
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        // Get only the 3 most recent bookings
        this.recentBookings = bookings.slice(0, 3);
        this.isLoadingBookings = false;
      },
      error: () => {
        this.isLoadingBookings = false;
      },
    });
  }

  getStatusSeverity(
    status: string
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status) {
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

  viewBookingDetails(booking: BookingResponse): void {
    this.router.navigate(['/ticket', booking.bookingUuid]);
  }

  navigateToMovies(): void {
    this.router.navigate(['/movies']);
  }

  navigateToBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
