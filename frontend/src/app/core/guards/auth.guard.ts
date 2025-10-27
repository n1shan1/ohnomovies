import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  return authService.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'You must be logged in to view that page.',
      });

      return router.createUrlTree(['/login']);
    })
  );
};
