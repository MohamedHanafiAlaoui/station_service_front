import { createReducer, on } from '@ngrx/store';
import { initialClientState } from './client.state';
import * as ClientActions from './client.actions';

export const clientReducer = createReducer(
  initialClientState,

  on(ClientActions.loadClient, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ClientActions.loadClientSuccess, (state, { client }) => ({
    ...state,
    loading: false,
    client
  })),

  on(ClientActions.loadClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ClientActions.loadHistorique, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ClientActions.loadHistoriqueSuccess, (state, { historique }) => ({
    ...state,
    loading: false,
    historique
  })),

  on(ClientActions.loadHistoriqueFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ClientActions.rechargeSolde, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ClientActions.rechargeSoldeSuccess, state => ({
    ...state,
    loading: false
  })),

  on(ClientActions.rechargeSoldeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
