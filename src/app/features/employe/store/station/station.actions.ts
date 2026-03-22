import { createAction, props } from '@ngrx/store';
import { Station } from '../../../../core/models/station';
export const loadStation = createAction(
  '[Station] Load Station',
  props<{ id: number }>()
);
export const loadStationSuccess = createAction(
  '[Station] Load Station Success',
  props<{ station: Station }>()
);
export const loadStationFailure = createAction(
  '[Station] Load Station Failure',
  props<{ error: string }>()
);