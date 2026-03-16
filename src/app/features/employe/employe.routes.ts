import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

// Reducers
import { clientsReducer } from './store/clients/clients.reducer';
import { pompesReducer } from './store/pompes/pompes.reducer';
import { ventesReducer } from './store/ventes/ventes.reducer';
import { approvisionnementsReducer } from './store/approvisionnements/approvisionnements.reducer';
import { journalReducer } from './store/journal/journal.reducer';
import { stationReducer } from './store/station/station.reducer';

// Effects
import { ClientsEffects } from './store/clients/clients.effects';
import { PompesEffects } from './store/pompes/pompes.effects';
import { VentesEffects } from './store/ventes/ventes.effects';
import { ApprovisionnementsEffects } from './store/approvisionnements/approvisionnements.effects';
import { JournalEffects } from './store/journal/journal.effects';
import { StationEffects } from './store/station/station.effects';

// Dashboard
import { DashboardEmploye } from './dashboard-employe/dashboard-employe';
import { StationDetails } from './station-details/station-details';

// Pompes
import { PompesList } from './pompes/pompes-list/pompes-list';
import { PompeDetails } from './pompes/pompes-details/pompe-details';
import { PompesAddFuel } from './pompes/pompes-add-fuel/pompes-add-fuel';

// Clients
import { ClientsList } from './clients/clients-list/clients-list';
import { ClientCreate } from './clients/client-create/client-create';
import { ClientEdit } from './clients/client-edit/client-edit';
import { ClientsRecharge } from './clients/clients-recharge/clients-recharge';

// Others
import { ApprovisionnementsList } from './approvisionnements/approvisionnements-list/approvisionnements-list';
import { JournalList } from './journal/journal-list/journal-list';
import { VentesList } from './ventes/ventes-list/ventes-list';
import { BadgeSell } from './ventes/badge-sell/badge-sell';

export const EMPLOYE_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState('clients', clientsReducer),
      provideState('pompes', pompesReducer),
      provideState('ventes', ventesReducer),
      provideState('approvisionnements', approvisionnementsReducer),
      provideState('journal', journalReducer),
      provideState('station', stationReducer),
      provideEffects([
        ClientsEffects,
        PompesEffects,
        VentesEffects,
        ApprovisionnementsEffects,
        JournalEffects,
        StationEffects
      ])
    ],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardEmploye },
      { path: 'station-details', component: StationDetails },
      
      { path: 'pompes', component: PompesList },
      { path: 'pompes/:id/details', component: PompeDetails },
      { path: 'pompes/:id/add-fuel', component: PompesAddFuel },
      
      { path: 'clients', component: ClientsList },
      { path: 'clients/create', component: ClientCreate },
      { path: 'clients/:id/edit', component: ClientEdit },
      { path: 'clients/:id/recharge', component: ClientsRecharge },
      
      { path: 'approvisionnements', component: ApprovisionnementsList },
      { path: 'journal', component: JournalList },
      { path: 'ventes', component: VentesList },
      { path: 'ventes/badge-sell', component: BadgeSell }
    ]
  }
];
