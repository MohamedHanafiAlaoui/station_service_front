import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/auth']);
    return false;
  }

  const requiredRole = route.data?.['role'];
  const userRole = auth.getRole();

  if (requiredRole && requiredRole !== userRole) {
    router.navigate(['/auth']);
    return false;
  }

  return true;
};
