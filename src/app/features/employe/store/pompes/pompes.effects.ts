import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PompeService } from '../../../../core/services/pompe.service';
import * as PompesActions from './pompes.actions';
@Injectable()
export class PompesEffects {
  private actions$ = inject(Actions);
  private pompeService = inject(PompeService);
  loadPompes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PompesActions.loadPompesByStation),
      mergeMap(action =>
        this.pompeService.getPompesByStation(action.stationId).pipe(
          map(pompes => PompesActions.loadPompesSuccess({ pompes })),
          catchError(error => {
            const errorMsg = error.error?.message || error.message || 'Impossible de charger les pompes';
            return of(PompesActions.loadPompesFailure({ error: errorMsg }));
          })
        )
      )
    )
  );
  addFuel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PompesActions.addFuel),
      mergeMap(action =>
        this.pompeService.addFuel(action.id, action.quantity).pipe(
          map(pompe => PompesActions.addFuelSuccess({ pompe })),
          catchError(error => {
            const errorMsg = error.error?.message || error.message || 'Échec de l\'ajout de carburant';
            return of(PompesActions.addFuelFailure({ error: errorMsg }));
          })
        )
      )
    )
  );
}