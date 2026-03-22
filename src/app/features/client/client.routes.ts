import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { Historique } from './historique/historique';
import { Profil } from './profil/profil';
import { Dashboard } from './dashboard/dashboard';
import { ClientEffects } from './store/client.effects';
import { clientReducer } from './store/client.reducer';
export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState('client', clientReducer),   
      provideEffects([ClientEffects])         
    ],
    children: [
      { path: '', component: Dashboard },
      { path: 'historique', component: Historique },
      { path: 'profil', component: Profil }
    ]
  }
];