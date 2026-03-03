import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout').then(m => m.Layout),
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
      },
      {
        path: 'admin',
        data: { role: 'ADMIN' },
        loadChildren: () =>
          import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
      },
      {
        path: 'employe',
        data: { role: 'EMPLOYE' },
        loadChildren: () =>
          import('./features/employe/employe.routes').then(m => m.EMPLOYE_ROUTES),
      },
      {
        path: 'client',
        data: { role: 'CLIENT' },
        loadChildren: () =>
          import('./features/client/client.routes').then(m => m.CLIENT_ROUTES),
      }
    ]
  }
];
