import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BadgeService } from '../../../../core/services/badge.service';
import * as BadgeActions from './badge.actions';
@Injectable()
export class BadgeEffects {
  private actions$ = inject(Actions);
  private badgeService = inject(BadgeService);
  sellFuelWithBadge$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BadgeActions.sellFuelWithBadge),
      mergeMap(action =>
        this.badgeService.sellFuel(action.request).pipe(
          map(response => BadgeActions.sellFuelWithBadgeSuccess({ response })),
          catchError(error => of(BadgeActions.sellFuelWithBadgeFailure({ error: error.message })))
        )
      )
    )
  );
}