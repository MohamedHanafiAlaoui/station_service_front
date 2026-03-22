import { createAction, props } from '@ngrx/store';
import { BadgeSellRequest } from '../../../../core/models/badge';
export const sellFuelWithBadge = createAction(
  '[Badge] Sell Fuel',
  props<{ request: BadgeSellRequest }>()
);
export const sellFuelWithBadgeSuccess = createAction(
  '[Badge] Sell Fuel Success',
  props<{ response: any }>()
);
export const sellFuelWithBadgeFailure = createAction(
  '[Badge] Sell Fuel Failure',
  props<{ error: string }>()
);