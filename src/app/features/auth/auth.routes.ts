import { Routes } from '@angular/router';
import { Login } from './login/login';
export const AUTH_ROUTES: Routes = [
  { path: '', component: Login },
  {path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) }
];