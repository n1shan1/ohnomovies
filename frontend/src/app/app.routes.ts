import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/user.model';

export const routes: Routes = [
  // 1. Admin Routes - Uses AdminLayout, Protected by AuthGuard AND RoleGuard
  {
    path: 'admin',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard, roleGuard],
    data: { role: Role.ADMIN },
    loadChildren: () => import('./features/admin/admin.route').then((m) => m.ADMIN_ROUTES),
  },

  // 2. Main User Routes - Uses MainLayout
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '', // Landing page (public)
        loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
      },
      {
        path: 'about-us',
        loadComponent: () => import('./features/about-us/about-us').then((m) => m.AboutUs),
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact').then((m) => m.Contact),
      },
      {
        path: 'movies',
        // Public route - no authGuard
        loadChildren: () => import('./features/movies/movies.routes').then((m) => m.MOVIES_ROUTES),
      },
      {
        path: 'booking',
        loadChildren: () =>
          import('./features/booking/booking.routes').then((m) => m.BOOKING_ROUTES),
      },
      {
        path: 'shows/:showtimeId/seats',
        loadComponent: () =>
          import('./features/booking/pages/seat-selection/seat-selection').then(
            (m) => m.SeatSelectionComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'ticket/:uuid',
        loadComponent: () =>
          import('./features/booking/pages/ticket/ticket').then((m) => m.TicketComponent),
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/profile/pages/profile').then((m) => m.Profile),
      },
      {
        path: 'my-bookings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/my-bookings/pages/my-bookings').then((m) => m.MyBookings),
      },
      // Auth routes - nested under MainLayout with guestGuard
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/pages/register/register').then((m) => m.Register),
      },
    ],
  },

  // 4. Error Routes
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/unauthorized/unauthorized').then((m) => m.UnauthorizedComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./layout/not-found/not-found').then((m) => m.NotFound),
  },
];
