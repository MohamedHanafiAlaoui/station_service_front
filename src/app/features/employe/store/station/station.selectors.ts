import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StationState } from './station.reducer';

export const selectStationState = createFeatureSelector<StationState>('station');

export const selectCurrentStation = createSelector(
  selectStationState,
  (state: StationState) => state.currentStation
);

export const selectStationLoading = createSelector(
  selectStationState,
  (state: StationState) => state.loading
);

export const selectStationError = createSelector(
  selectStationState,
  (state: StationState) => state.error
);
