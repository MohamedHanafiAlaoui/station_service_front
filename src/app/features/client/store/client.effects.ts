import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClientActions from './client.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ClientService } from '../../../core/services/client';
import { UserService } from '../../../core/services/user';

@Injectable()
export class ClientEffects {

  private readonly actions$ = inject(Actions);
  private readonly client = inject(ClientService);
  private readonly userService = inject(UserService);

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


  updateClientName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateClientName),
      mergeMap(({ id, nom, prenom }) =>
        this.userService.updateNomPrenom(id, { nom, prenom }).pipe(
          map(() => ClientActions.updateClientNameSuccess({ nom, prenom })),
          catchError(err =>
            of(ClientActions.updateClientNameFailure({ error: err.message }))
          )
        )
      )
    )
  );
  
  
  
}
