import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { loginRedirectGuard } from './core/guards/login-redirect-guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [loginRedirectGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { role: 'ROLE_ADMIN' },
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    loadComponent: () =>
      import('./features/admin/admin-layout/adminlayout/adminlayout')
        .then(m => m.Adminlayout),
  },
  {
    path: 'employe',
    canActivate: [authGuard],
    data: { role: 'ROLE_EMPLOYE' },
    loadChildren: () =>
      import('./features/employe/employe.routes').then(m => m.EMPLOYE_ROUTES),
    loadComponent: () =>
      import('./shared/components/layout/layout')
        .then(m => m.Layout),
  },
  {
    path: 'client',
    canActivate: [authGuard],
    data: { role: 'ROLE_CLIENT' },
    loadChildren: () =>
      import('./features/client/client.routes').then(m => m.CLIENT_ROUTES),
    loadComponent: () =>
      import('./features/client/clientlayout/clientlayout')
        .then(m => m.Clientlayout),
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' }
];