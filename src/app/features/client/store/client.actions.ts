import { createAction, props } from '@ngrx/store';

export const loadClient = createAction(
  '[Client] Load Client',
  props<{ id: number }>()
);

export const loadClientSuccess = createAction(
  '[Client] Load Client Success',
  props<{ client: any }>()
);

export const loadClientFailure = createAction(
  '[Client] Load Client Failure',
  props<{ error: string }>()
);

export const loadHistorique = createAction(
  '[Client] Load Historique',
  props<{ clientId: number; start: string; end: string; pageable: any }>()
);

export const loadHistoriqueSuccess = createAction(
  '[Client] Load Historique Success',
  props<{ historique: any[] }>()
);

export const loadHistoriqueFailure = createAction(
  '[Client] Load Historique Failure',
  props<{ error: string }>()
);

export const rechargeSolde = createAction(
  '[Client] Recharge Solde',
  props<{ id: number; montant: number }>()
);

export const rechargeSoldeSuccess = createAction(
  '[Client] Recharge Solde Success'
);

export const rechargeSoldeFailure = createAction(
  '[Client] Recharge Solde Failure',
  props<{ error: string }>()
);
