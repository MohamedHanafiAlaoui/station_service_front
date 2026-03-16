import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientsState } from './clients.reducer';
import { ClientDto } from '../../../../core/models/client';

const selectClientsState = createFeatureSelector<ClientsState>('clients');

export const selectAllClients = createSelector(
  selectClientsState,
  (state): ClientDto[] => state.clients
);

export const selectClientById = (id: number) => createSelector(
  selectAllClients,
  (clients): ClientDto | undefined => clients.find(c => c.id === id)
);

export const selectClientsLoading = createSelector(
  selectClientsState,
  (state): boolean => state.loading
);

export const selectClientsActionLoading = createSelector(
  selectClientsState,
  (state): boolean => state.actionLoading
);

export const selectClientsError = createSelector(
  selectClientsState,
  (state): string | null => state.error
);
