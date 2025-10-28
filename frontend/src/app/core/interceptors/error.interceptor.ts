import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let errorHandled = false;
      switch (err.status) {
        case 401:
          storageService.clearAll();
          router.navigate(['/login']);
          errorHandled = true;
          break;
      }
      return throwError(() => err);
    })
  );
};
