import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VentesState } from './ventes.reducer';

export const selectVentesState = createFeatureSelector<VentesState>('ventes');

export const selectAllVentes = createSelector(
  selectVentesState,
  (state: VentesState) => state.ventes
);

export const selectVentesPagination = createSelector(
  selectVentesState,
  (state: VentesState) => ({
    totalElements: state.totalElements,
    totalPages: state.totalPages
  })
);

export const selectVentesStats = createSelector(
  selectVentesState,
  (state: VentesState) => state.stats
);

export const selectVentesLoading = createSelector(
  selectVentesState,
  (state: VentesState) => state.loading
);

export const selectVentesStatsLoading = createSelector(
  selectVentesState,
  (state: VentesState) => state.statsLoading
);

export const selectVentesError = createSelector(
  selectVentesState,
  (state: VentesState) => state.error
);
