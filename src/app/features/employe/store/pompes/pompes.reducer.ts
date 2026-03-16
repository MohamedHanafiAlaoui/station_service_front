import { createReducer, on } from '@ngrx/store';
import * as PompesActions from './pompes.actions';
import { Pompe } from '../../../../core/models/pompe';

export interface PompesState {
  pompes: Pompe[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
}

export const initialPompesState: PompesState = {
  pompes: [],
  loading: false,
  error: null,
  actionLoading: false
};

export const pompesReducer = createReducer(
  initialPompesState,
  
  // Load Pompes
  on(PompesActions.loadPompesByStation, state => ({ ...state, loading: true, error: null })),
  on(PompesActions.loadPompesSuccess, (state, { pompes }) => ({ ...state, pompes, loading: false })),
  on(PompesActions.loadPompesFailure, (state, { error }) => ({ ...state, error, loading: false })),
  
  // Add Fuel
  on(PompesActions.addFuel, state => ({ ...state, actionLoading: true, error: null })),
  on(PompesActions.addFuelSuccess, (state, { pompe }) => {
    const updatedPompes = state.pompes.map(p => p.id === pompe.id ? pompe : p);
    return { ...state, pompes: updatedPompes, actionLoading: false };
  }),
  on(PompesActions.addFuelFailure, (state, { error }) => ({ ...state, error, actionLoading: false }))
);
