import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const authGuard: CanMatchFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem("access");

  if (token) {
    return true;
  }

  router.navigate(['/login']);

  return false;
};
