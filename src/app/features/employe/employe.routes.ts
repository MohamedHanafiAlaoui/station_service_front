import { Routes } from '@angular/router';
import { Ventes } from './ventes/ventes';
import { Pompes } from './pompes/pompes';
import { Dashboard } from './dashboard/dashboard';

export const EMPLOYE_ROUTES: Routes = [
  { path: '', component: Dashboard },
  { path: 'ventes', component: Ventes },
  { path: 'pompes', component: Pompes }
];
