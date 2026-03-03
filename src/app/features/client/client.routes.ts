import { Routes } from '@angular/router';
import { Historique } from './historique/historique';
import { Profil } from './profil/profil';
import { Solde } from './solde/solde';
import { Dashboard } from './dashboard/dashboard';

export const CLIENT_ROUTES: Routes = [
  { path: '', component: Dashboard},
  { path: 'solde', component: Solde },
  { path: 'historique', component: Historique },
  { path: 'profil', component: Profil }
];
