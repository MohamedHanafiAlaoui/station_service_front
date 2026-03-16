import { createReducer, on } from '@ngrx/store';
import { ClientDto } from '../../../../core/models/client';
import * as ClientsActions from './clients.actions';

export interface ClientsState {
  clients: ClientDto[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

export const initialClientsState: ClientsState = {
  clients: [],
  loading: false,
  actionLoading: false,
  error: null
};

export const clientsReducer = createReducer(
  initialClientsState,

  // Load / Search
  on(ClientsActions.loadClients, ClientsActions.searchClients,
    state => ({ ...state, loading: true, error: null })),
  on(ClientsActions.loadClientsSuccess, ClientsActions.searchClientsSuccess,
    (state, { clients }) => ({ ...state, clients, loading: false })),
  on(ClientsActions.loadClientsFailure, ClientsActions.searchClientsFailure,
    (state, { error }) => ({ ...state, error, loading: false })),

  // Create
  on(ClientsActions.createClient,
    state => ({ ...state, actionLoading: true, error: null })),
  on(ClientsActions.createClientSuccess,
    (state, { client }) => ({ ...state, clients: [...state.clients, client], actionLoading: false })),
  on(ClientsActions.createClientFailure,
    (state, { error }) => ({ ...state, error, actionLoading: false })),

  // Update
  on(ClientsActions.updateClient,
    state => ({ ...state, actionLoading: true, error: null })),
  on(ClientsActions.updateClientSuccess,
    (state, { client }) => ({
      ...state,
      clients: state.clients.map(c => c.id === client.id ? client : c),
      actionLoading: false
    })),
  on(ClientsActions.updateClientFailure,
    (state, { error }) => ({ ...state, error, actionLoading: false })),

  // Delete
  on(ClientsActions.deleteClient,
    state => ({ ...state, actionLoading: true, error: null })),
  on(ClientsActions.deleteClientSuccess,
    (state, { id }) => ({
      ...state,
      clients: state.clients.filter(c => c.id !== id),
      actionLoading: false
    })),
  on(ClientsActions.deleteClientFailure,
    (state, { error }) => ({ ...state, error, actionLoading: false })),

  // Recharge
  on(ClientsActions.rechargeClient,
    state => ({ ...state, actionLoading: true, error: null })),
  on(ClientsActions.rechargeClientSuccess,
    (state, { id, montant }) => ({
      ...state,
      clients: state.clients.map(c =>
        c.id === id ? { ...c, solde: (c.solde ?? 0) + montant } : c
      ),
      actionLoading: false
    })),
  on(ClientsActions.rechargeClientFailure,
    (state, { error }) => ({ ...state, error, actionLoading: false }))
);
