import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth';

export const loginRedirectGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // إذا لم يكن مسجلاً الدخول، اسمح له برؤية صفحة auth (login/register)
  if (!auth.isLoggedIn()) {
    return true;
  }

  // إذا كان مسجلاً الدخول، أعِده مباشرةً إلى المسار المناسب حسب الدور
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

  // في حال دور غير معروف، أعده إلى /auth كخيار آمن
  return router.createUrlTree(['/auth']);
};

