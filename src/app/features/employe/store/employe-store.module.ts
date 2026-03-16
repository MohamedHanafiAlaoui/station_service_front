import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { stationReducer } from './station/station.reducer';
import { pompesReducer } from './pompes/pompes.reducer';
import { approvisionnementsReducer } from './approvisionnements/approvisionnements.reducer';
import { clientsReducer } from './clients/clients.reducer';
import { badgeReducer } from './badge/badge.reducer';
import { journalReducer } from './journal/journal.reducer';
import { ventesReducer } from './ventes/ventes.reducer';

import { StationEffects } from './station/station.effects';
import { PompesEffects } from './pompes/pompes.effects';
import { ApprovisionnementsEffects } from './approvisionnements/approvisionnements.effects';
import { ClientsEffects } from './clients/clients.effects';
import { BadgeEffects } from './badge/badge.effects';
import { JournalEffects } from './journal/journal.effects';
import { VentesEffects } from './ventes/ventes.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('station', stationReducer),
    StoreModule.forFeature('pompes', pompesReducer),
    StoreModule.forFeature('approvisionnements', approvisionnementsReducer),
    StoreModule.forFeature('clients', clientsReducer),
    StoreModule.forFeature('badge', badgeReducer),
    StoreModule.forFeature('journal', journalReducer),
    StoreModule.forFeature('ventes', ventesReducer),
    EffectsModule.forFeature([
      StationEffects,
      PompesEffects,
      ApprovisionnementsEffects,
      ClientsEffects,
      BadgeEffects,
      JournalEffects,
      VentesEffects
    ])
  ]
})
export class EmployeStoreModule {}
