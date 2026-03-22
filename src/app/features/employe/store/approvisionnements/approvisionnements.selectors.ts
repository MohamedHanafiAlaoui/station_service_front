import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApprovisionnementsState } from './approvisionnements.reducer';
export const selectApprovisionnementsState = createFeatureSelector<ApprovisionnementsState>('approvisionnements');
export const selectAllApprovisionnements = createSelector(
  selectApprovisionnementsState,
  (state: ApprovisionnementsState) => state.approvisionnements
);
export const selectApprovisionnementsLoading = createSelector(
  selectApprovisionnementsState,
  (state: ApprovisionnementsState) => state.loading
);
export const selectApprovisionnementsError = createSelector(
  selectApprovisionnementsState,
  (state: ApprovisionnementsState) => state.error
);