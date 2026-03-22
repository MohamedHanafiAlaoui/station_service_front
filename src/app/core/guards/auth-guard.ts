import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/Auth';
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = auth.isLoggedIn();
  const userRole = auth.getRole();
  const requiredRole = route.data?.['role'] as string | undefined;
  if (!isLoggedIn) {
    return router.createUrlTree(['/auth']);
  }
  if (requiredRole && requiredRole !== userRole) {
    return router.createUrlTree(['/auth']);
  }
  return true;
};