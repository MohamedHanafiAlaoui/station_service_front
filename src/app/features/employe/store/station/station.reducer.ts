import { createReducer, on } from '@ngrx/store';
import * as StationActions from './station.actions';
import { Station } from '../../../../core/models/station';
export interface StationState {
  currentStation: Station | null;
  loading: boolean;
  error: string | null;
}
export const initialStationState: StationState = {
  currentStation: null,
  loading: false,
  error: null
};
export const stationReducer = createReducer(
  initialStationState,
  on(StationActions.loadStation, state => ({ ...state, loading: true, error: null })),
  on(StationActions.loadStationSuccess, (state, { station }) => ({ ...state, currentStation: station, loading: false })),
  on(StationActions.loadStationFailure, (state, { error }) => ({ ...state, error, loading: false }))
);