import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientService } from '../../../../core/services/client';
import { ToastService } from '../../../../core/services/toast.service';
import * as ClientsActions from './clients.actions';

@Injectable()
export class ClientsEffects {
  private actions$ = inject(Actions);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.loadClients),
      mergeMap(() =>
        this.clientService.getAllClients().pipe(
          map(clients => ClientsActions.loadClientsSuccess({ clients })),
          catchError(error => of(ClientsActions.loadClientsFailure({ error: error.message })))
        )
      )
    )
  );

  searchClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.searchClients),
      mergeMap(action =>
        this.clientService.searchClients(action.keyword).pipe(
          map(clients => ClientsActions.searchClientsSuccess({ clients })),
          catchError(error => of(ClientsActions.searchClientsFailure({ error: error.message })))
        )
      )
    )
  );

  createClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.createClient),
      mergeMap(action =>
        this.clientService.createClient(action.client).pipe(
          map(client => ClientsActions.createClientSuccess({ client })),
          catchError(error => {
            console.error('Client Creation Error:', error);
            const msg = error.error?.message || error.message || 'Error creating client';
            return of(ClientsActions.createClientFailure({ error: msg }));
          })
        )
      )
    )
  );

  createClientSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.createClientSuccess),
      tap(({ client }) => {
        this.toastService.success(`Client ${client.prenom} ${client.nom} created successfully!`);
        this.router.navigate(['/employe/clients']);
      })
    ),
    { dispatch: false }
  );

  createClientFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.createClientFailure),
      tap(({ error }) => this.toastService.error(error))
    ),
    { dispatch: false }
  );

  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.updateClient),
      mergeMap(action =>
        this.clientService.updateClient(action.id, action.client).pipe(
          map(client => ClientsActions.updateClientSuccess({ client })),
          catchError(error => of(ClientsActions.updateClientFailure({ error: error.message })))
        )
      )
    )
  );

  updateClientSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.updateClientSuccess),
      tap(({ client }) => {
        this.toastService.success(`Client ${client.prenom} updated successfully.`);
        this.router.navigate(['/employe/clients']);
      })
    ),
    { dispatch: false }
  );

  updateClientFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.updateClientFailure),
      tap(({ error }) => this.toastService.error(error))
    ),
    { dispatch: false }
  );

  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.deleteClient),
      mergeMap(action =>
        this.clientService.deleteClient(action.id).pipe(
          map(() => ClientsActions.deleteClientSuccess({ id: action.id })),
          catchError(error => of(ClientsActions.deleteClientFailure({ error: error.message })))
        )
      )
    )
  );

  deleteClientSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.deleteClientSuccess),
      tap(() => this.toastService.success('Client deleted successfully.'))
    ),
    { dispatch: false }
  );

  rechargeClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.rechargeClient),
      mergeMap(action =>
        this.clientService.recharge(action.id, action.montant).pipe(
          map(() => ClientsActions.rechargeClientSuccess({ id: action.id, montant: action.montant })),
          catchError(error => of(ClientsActions.rechargeClientFailure({ error: error.message })))
        )
      )
    )
  );

  rechargeClientSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.rechargeClientSuccess),
      tap(({ montant }) => {
        this.toastService.success(`Recharge of ${montant} MAD successful!`);
        this.router.navigate(['/employe/clients']);
      })
    ),
    { dispatch: false }
  );

  rechargeClientFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.rechargeClientFailure),
      tap(({ error }) => this.toastService.error(error))
    ),
    { dispatch: false }
  );
}
