import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth';
export const loginRedirectGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    return true;
  }
  const role = auth.getRole();
  if (role === 'ROLE_ADMIN') {
    return router.createUrlTree(['/admin']);
  }
  if (role === 'ROLE_EMPLOYE') {
    return router.createUrlTree(['/employe']);
  }
  if (role === 'ROLE_CLIENT') {
    return router.createUrlTree(['/client']);
  }
  return router.createUrlTree(['/auth']);
};