import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.state';
export const selectClientState = createFeatureSelector<ClientState>('client');
export const selectClient = createSelector(selectClientState, s => s.client);
export const selectHistorique = createSelector(selectClientState, s => s.historique);
export const selectLoading = createSelector(selectClientState, s => s.loading);
export const selectError = createSelector(selectClientState, s => s.error);