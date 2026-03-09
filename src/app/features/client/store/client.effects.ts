import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClientActions from './client.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ClientService } from '../../../core/services/client'; // ✔ هذا هو الصحيح

@Injectable()
export class ClientEffects {

  constructor(private actions$: Actions, private client: ClientService) {}

  loadClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClient),
      mergeMap(({ id }) =>
        this.client.getClientById(id).pipe(
          map(client => ClientActions.loadClientSuccess({ client })),
          catchError(err => of(ClientActions.loadClientFailure({ error: err })))
        )
      )
    )
  );

  loadHistorique$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadHistorique),
      mergeMap(({ clientId, start, end, pageable }) =>
        this.client.getHistorique(clientId, start, end, pageable).pipe(
          map(page => ClientActions.loadHistoriqueSuccess({ historique: page.content })),
          catchError(err => of(ClientActions.loadHistoriqueFailure({ error: err })))
        )
      )
    )
  );

  rechargeSolde$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.rechargeSolde),
      mergeMap(({ id, montant }) =>
        this.client.recharge(id, montant).pipe(
          map(() => ClientActions.rechargeSoldeSuccess()),
          catchError(err => of(ClientActions.rechargeSoldeFailure({ error: err })))
        )
      )
    )
  );
}
