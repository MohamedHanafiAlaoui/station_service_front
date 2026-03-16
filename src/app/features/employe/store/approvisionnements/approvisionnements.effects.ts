import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApprovisionnementService } from '../../../../core/services/approvisionnement.service';
import * as ApprovisionnementsActions from './approvisionnements.actions';

@Injectable()
export class ApprovisionnementsEffects {
  private actions$ = inject(Actions);
  private approvoService = inject(ApprovisionnementService);

  loadApprovisionnements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApprovisionnementsActions.loadApprovisionnements),
      mergeMap(action =>
        this.approvoService.getApprovisionnementsByStation(action.stationId).pipe(
          map(approvisionnements => ApprovisionnementsActions.loadApprovisionnementsSuccess({ approvisionnements })),
          catchError(error => of(ApprovisionnementsActions.loadApprovisionnementsFailure({ error: error.message })))
        )
      )
    )
  );
}
