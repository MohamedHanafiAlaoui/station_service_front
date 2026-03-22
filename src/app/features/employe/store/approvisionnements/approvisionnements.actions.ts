import { createAction, props } from '@ngrx/store';
import { Approvisionnement } from '../../../../core/models/approvisionnement';
export const loadApprovisionnements = createAction(
  '[Approvisionnements] Load Approvisionnements',
  props<{ stationId: number }>()
);
export const loadApprovisionnementsSuccess = createAction(
  '[Approvisionnements] Load Approvisionnements Success',
  props<{ approvisionnements: Approvisionnement[] }>()
);
export const loadApprovisionnementsFailure = createAction(
  '[Approvisionnements] Load Approvisionnements Failure',
  props<{ error: string }>()
);