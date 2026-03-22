import { createReducer, on } from '@ngrx/store';
import * as ApprovisionnementsActions from './approvisionnements.actions';
import { Approvisionnement } from '../../../../core/models/approvisionnement';
export interface ApprovisionnementsState {
  approvisionnements: Approvisionnement[];
  loading: boolean;
  error: string | null;
}
export const initialApprovisionnementsState: ApprovisionnementsState = {
  approvisionnements: [],
  loading: false,
  error: null
};
export const approvisionnementsReducer = createReducer(
  initialApprovisionnementsState,
  on(ApprovisionnementsActions.loadApprovisionnements, state => ({ ...state, loading: true, error: null })),
  on(ApprovisionnementsActions.loadApprovisionnementsSuccess, (state, { approvisionnements }) => ({ ...state, approvisionnements, loading: false })),
  on(ApprovisionnementsActions.loadApprovisionnementsFailure, (state, { error }) => ({ ...state, error, loading: false }))
);