import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { VenteService } from '../../../../core/services/vente.service';
import * as VentesActions from './ventes.actions';

@Injectable()
export class VentesEffects {
  private actions$ = inject(Actions);
  private venteService = inject(VenteService);

  loadVentes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VentesActions.loadVentes),
      mergeMap(action =>
        this.venteService.getVentesByStation(action.stationId, action.start, action.end, action.pageable).pipe(
          map(response => VentesActions.loadVentesSuccess({ response })),
          catchError(error => of(VentesActions.loadVentesFailure({ error: error.message })))
        )
      )
    )
  );

  loadVentesByPompe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VentesActions.loadVentesByPompe),
      mergeMap(action =>
        this.venteService.getVentesByStationAndPompe(action.stationId, action.pompeId, action.start, action.end, action.pageable).pipe(
          map(response => VentesActions.loadVentesByPompeSuccess({ response })),
          catchError(error => of(VentesActions.loadVentesByPompeFailure({ error: error.message })))
        )
      )
    )
  );

  loadVentesStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VentesActions.loadVentesStats),
      mergeMap(action =>
        forkJoin({
          totalQuantite: this.venteService.getTotalQuantiteByStation(action.stationId, action.start, action.end),
          totalMontant: this.venteService.getTotalMontantByStation(action.stationId, action.start, action.end)
        }).pipe(
          map(({ totalQuantite, totalMontant }) => VentesActions.loadVentesStatsSuccess({ totalQuantite, totalMontant })),
          catchError(error => of(VentesActions.loadVentesStatsFailure({ error: error.message })))
        )
      )
    )
  );
}
