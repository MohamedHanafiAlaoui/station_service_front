import { createAction, props } from '@ngrx/store';
export const loadVentes = createAction(
  '[Ventes] Load Ventes',
  props<{ stationId: number; start: string; end: string; pageable: any }>()
);
export const loadVentesSuccess = createAction(
  '[Ventes] Load Ventes Success',
  props<{ response: any }>()
);
export const loadVentesFailure = createAction(
  '[Ventes] Load Ventes Failure',
  props<{ error: string }>()
);
export const loadVentesByPompe = createAction(
  '[Ventes] Load Ventes By Pompe',
  props<{ stationId: number; pompeId: number; start: string; end: string; pageable: any }>()
);
export const loadVentesByPompeSuccess = createAction(
  '[Ventes] Load Ventes By Pompe Success',
  props<{ response: any }>()
);
export const loadVentesByPompeFailure = createAction(
  '[Ventes] Load Ventes By Pompe Failure',
  props<{ error: string }>()
);
export const loadVentesStats = createAction(
  '[Ventes] Load Ventes Stats',
  props<{ stationId: number; start: string; end: string }>()
);
export const loadVentesStatsSuccess = createAction(
  '[Ventes] Load Ventes Stats Success',
  props<{ totalQuantite: number; totalMontant: number }>()
);
export const loadVentesStatsFailure = createAction(
  '[Ventes] Load Ventes Stats Failure',
  props<{ error: string }>()
);