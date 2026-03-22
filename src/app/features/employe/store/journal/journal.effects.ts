import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { JournalService } from '../../../../core/services/journal.service';
import * as JournalActions from './journal.actions';
@Injectable()
export class JournalEffects {
  private actions$ = inject(Actions);
  private journalService = inject(JournalService);
  loadJournals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JournalActions.loadJournals),
      mergeMap(action =>
        this.journalService.getJournalsByStation(action.stationId, action.start, action.end, action.pageable).pipe(
          map(response => JournalActions.loadJournalsSuccess({ response })),
          catchError(error => of(JournalActions.loadJournalsFailure({ error: error.message })))
        )
      )
    )
  );
}