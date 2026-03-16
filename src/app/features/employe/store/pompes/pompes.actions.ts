import { createAction, props } from '@ngrx/store';
import { Pompe } from '../../../../core/models/pompe';

export const loadPompesByStation = createAction(
  '[Pompes] Load Pompes By Station',
  props<{ stationId: number }>()
);

export const loadPompesSuccess = createAction(
  '[Pompes] Load Pompes Success',
  props<{ pompes: Pompe[] }>()
);

export const loadPompesFailure = createAction(
  '[Pompes] Load Pompes Failure',
  props<{ error: string }>()
);

export const addFuel = createAction(
  '[Pompes] Add Fuel',
  props<{ id: number, quantity: number }>()
);

export const addFuelSuccess = createAction(
  '[Pompes] Add Fuel Success',
  props<{ pompe: Pompe }>()
);

export const addFuelFailure = createAction(
  '[Pompes] Add Fuel Failure',
  props<{ error: string }>()
);
