import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { Ventes } from './ventes/ventes';
import { Pompes } from './pompes/pompes';
import { DashboardEmploye } from './dashboard-employe/dashboard-employe';
import { ApprovisionnementsList } from './approvisionnements/approvisionnements-list/approvisionnements-list';
import { PompesAddFuel } from './pompes/pompes-add-fuel/pompes-add-fuel';
import { VentesList } from './ventes/ventes-list/ventes-list';
import { BadgeSell } from './ventes/badge-sell/badge-sell';
import { PompesList } from './pompes/pompes-list/pompes-list';
import { PompeDetails } from './pompes/pompes-details/pompe-details';
import { ClientsList } from './clients/clients-list/clients-list';
import { ClientCreate } from './clients/client-create/client-create';
import { ClientEdit } from './clients/client-edit/client-edit';
import { ClientsRecharge } from './clients/clients-recharge/clients-recharge';
import { StationDetails } from './station-details/station-details';
import { JournalList } from './journal/journal-list/journal-list';

import { stationReducer } from './store/station/station.reducer';
import { pompesReducer } from './store/pompes/pompes.reducer';
import { approvisionnementsReducer } from './store/approvisionnements/approvisionnements.reducer';
import { clientsReducer } from './store/clients/clients.reducer';
import { badgeReducer } from './store/badge/badge.reducer';
import { journalReducer } from './store/journal/journal.reducer';
import { ventesReducer } from './store/ventes/ventes.reducer';

import { StationEffects } from './store/station/station.effects';
import { PompesEffects } from './store/pompes/pompes.effects';
import { ApprovisionnementsEffects } from './store/approvisionnements/approvisionnements.effects';
import { ClientsEffects } from './store/clients/clients.effects';
import { BadgeEffects } from './store/badge/badge.effects';
import { JournalEffects } from './store/journal/journal.effects';
import { VentesEffects } from './store/ventes/ventes.effects';

export const EMPLOYE_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState('station', stationReducer),
      provideState('pompes', pompesReducer),
      provideState('approvisionnements', approvisionnementsReducer),
      provideState('clients', clientsReducer),
      provideState('badge', badgeReducer),
      provideState('journal', journalReducer),
      provideState('ventes', ventesReducer),
      provideEffects([
        StationEffects,
        PompesEffects,
        ApprovisionnementsEffects,
        ClientsEffects,
        BadgeEffects,
        JournalEffects,
        VentesEffects
      ])
    ],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardEmploye },
      {
        path: 'ventes',
        component: Ventes,
        children: [
          { path: '', component: VentesList },
          { path: 'badge-sell', component: BadgeSell }
        ]
      },
      {
        path: 'pompes',
        component: Pompes,
        children: [
          { path: '', component: PompesList },
          { path: ':id/add-fuel', component: PompesAddFuel },
          { path: ':id/details', component: PompeDetails }
        ]
      },
      { path: 'approvisionnements', component: ApprovisionnementsList },
      { path: 'clients', component: ClientsList },
      { path: 'clients/create', component: ClientCreate },
      { path: 'clients/:id/edit', component: ClientEdit },
      { path: 'clients/:id/recharge', component: ClientsRecharge },
      { path: 'station-details', component: StationDetails },
      { path: 'journal', component: JournalList }
    ]
  }
];