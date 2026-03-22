import { Routes } from '@angular/router';
import { Ventes } from './ventes/ventes';
import { Pompes } from './pompes/pompes';
import { DashboardEmploye } from './dashboard-employe/dashboard-employe';
export const EMPLOYE_ROUTES: Routes = [
  { path: '', component: DashboardEmploye },
  { path: 'ventes', component: Ventes },
  { path: 'pompes', component: Pompes }
];