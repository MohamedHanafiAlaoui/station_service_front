import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // ---------------- ADMIN ----------------
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { role: 'ADMIN' },

    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),

    loadComponent: () =>
      import('./features/admin/admin-layout/adminlayout/adminlayout')
        .then(m => m.Adminlayout),
  },

  // ---------------- EMPLOYE ----------------
  {
    path: 'employe',
    canActivate: [authGuard],
    data: { role: 'EMPLOYE' },

    loadChildren: () =>
      import('./features/employe/employe.routes').then(m => m.EMPLOYE_ROUTES),

    loadComponent: () =>
      import('./features/employe/employe-layout/employelayout/employelayout')
        .then(m => m.Employelayout),
  },

  // ---------------- CLIENT ----------------
  {
    path: 'client',
    canActivate: [authGuard],
    data: { role: 'CLIENT' },

    loadChildren: () =>
      import('./features/client/client.routes').then(m => m.CLIENT_ROUTES),

    loadComponent: () =>
      import('./features/client/clientlayout/clientlayout')
        .then(m => m.Clientlayout),
  },

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
