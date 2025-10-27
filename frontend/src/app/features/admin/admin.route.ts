import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./pages/movie-management/movie-management').then((m) => m.MovieManagementComponent),
  },
  {
    path: 'theaters',
    loadComponent: () =>
      import('./pages/theater-management/theater-management').then(
        (m) => m.TheaterManagementComponent
      ),
  },
  {
    path: 'screens',
    loadComponent: () =>
      import('./pages/screen-management/screen-management').then(
        (m) => m.ScreenManagementComponent
      ),
  },
  {
    path: 'theaters/:id/screens',
    loadComponent: () =>
      import('./pages/screen-management/screen-management').then(
        (m) => m.ScreenManagementComponent
      ),
  },
  {
    path: 'showtimes',
    loadComponent: () =>
      import('./pages/showtime-management/showtime-management').then(
        (m) => m.ShowtimeManagementComponent
      ),
  },
  {
    path: 'bookings',
    loadComponent: () =>
      import('./pages/booking-management/booking-management').then(
        (m) => m.BookingManagementComponent
      ),
  },
];
