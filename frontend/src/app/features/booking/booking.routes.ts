import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const BOOKING_ROUTES: Routes = [
  {
    path: 'showtime/:showtimeId/seats',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/seat-selection/seat-selection').then((m) => m.SeatSelectionComponent),
  },
  {
    path: 'ticket/:uuid',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/ticket/ticket').then((m) => m.TicketComponent),
  },
];
