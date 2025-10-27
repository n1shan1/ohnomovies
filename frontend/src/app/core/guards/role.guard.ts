import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';
import { MessageService } from 'primeng/api';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const requiredRole = route.data['role'] as Role;

  if (authService.hasRole(requiredRole)) {
    return true;
  }

  messageService.add({
    severity: 'error',
    summary: 'Access Denied',
    detail: 'You do not have permission for this page.',
  });

  return router.createUrlTree(['/']); // Redirect to landing
};
