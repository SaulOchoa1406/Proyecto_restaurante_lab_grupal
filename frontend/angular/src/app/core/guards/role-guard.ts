import { inject } from '@angular/core';
import {  CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const roleGuard = (rolPermitido: string): CanActivateFn => {
  return () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.getCurrentUser().pipe(
      map(user => {
        if (user.rol === rolPermitido) {
          return true;
        }

        router.navigate(['/login']);
        
        return false;
      }),

      catchError(() => {
        router.navigate(['/login']);

        return of(false);
      })
      
    );

  };
};
