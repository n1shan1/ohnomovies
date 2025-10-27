import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { MessageService } from 'primeng/api'; // PrimeNG Toast

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let errorHandled = false;
      const isBookingEndpoint = err.url?.includes('/seats/lock') || err.url?.includes('/bookings');
      switch (err.status) {
        case 401:
          storageService.clearAll();
          router.navigate(['/login']);
          errorHandled = true;
          break;
        case 403:
          messageService.add({
            severity: 'error',
            summary: 'Forbidden',
            detail: err.error?.message || 'You do not have permission.',
          });
          errorHandled = true;
          break;
        case 400:
        case 409:
          if (!isBookingEndpoint) {
            messageService.add({
              severity: 'warn',
              summary: err.status === 400 ? 'Invalid Request' : 'Conflict',
              detail:
                err.error?.message || err.error?.error || 'The operation could not be completed.',
            });
          }
          errorHandled = true;
          break;
        case 404:
          messageService.add({
            severity: 'error',
            summary: 'Not Found',
            detail: 'The requested resource was not found.',
          });
          errorHandled = true;
          break;
      }
      if (!errorHandled && err.status >= 500) {
        messageService.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'An unexpected error occurred.',
        });
      }
      return throwError(() => err);
    })
  );
};
