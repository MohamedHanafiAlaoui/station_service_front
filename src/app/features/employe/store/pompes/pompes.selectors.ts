import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PompesState } from './pompes.reducer';
export const selectPompesState = createFeatureSelector<PompesState>('pompes');
export const selectAllPompes = createSelector(
  selectPompesState,
  (state: PompesState) => state.pompes
);
export const selectPompeById = (pompeId: number) => createSelector(
  selectAllPompes,
  (pompes) => pompes.find(p => p.id === pompeId)
);
export const selectPompesLoading = createSelector(
  selectPompesState,
  (state: PompesState) => state.loading
);
export const selectPompesActionLoading = createSelector(
  selectPompesState,
  (state: PompesState) => state.actionLoading
);
export const selectPompesError = createSelector(
  selectPompesState,
  (state: PompesState) => state.error
);