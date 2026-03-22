import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { StationService } from '../../../../core/services/station';
import * as StationActions from './station.actions';
@Injectable()
export class StationEffects {
  private actions$ = inject(Actions);
  private stationService = inject(StationService);
  loadStation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StationActions.loadStation),
      mergeMap(action =>
        this.stationService.getStationById(action.id).pipe(
          map(station => StationActions.loadStationSuccess({ station })),
          catchError(error => of(StationActions.loadStationFailure({ error: error.message })))
        )
      )
    )
  );
}