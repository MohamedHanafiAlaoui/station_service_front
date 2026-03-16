import { createReducer, on } from '@ngrx/store';
import * as VentesActions from './ventes.actions';
import { Vente } from '../../../../core/models/vente';

export interface VentesState {
  ventes: Vente[];
  totalElements: number;
  totalPages: number;
  stats: {
    totalQuantite: number;
    totalMontant: number;
  };
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
}

export const initialVentesState: VentesState = {
  ventes: [],
  totalElements: 0,
  totalPages: 0,
  stats: {
    totalQuantite: 0,
    totalMontant: 0
  },
  loading: false,
  statsLoading: false,
  error: null
};

export const ventesReducer = createReducer(
  initialVentesState,
  
  // Load Ventes
  on(VentesActions.loadVentes, state => ({ ...state, loading: true, error: null })),
  on(VentesActions.loadVentesSuccess, (state, { response }) => ({ 
    ...state, 
    ventes: response.content,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    loading: false 
  })),
  on(VentesActions.loadVentesFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Load Ventes By Pompe
  on(VentesActions.loadVentesByPompe, state => ({ ...state, loading: true, error: null })),
  on(VentesActions.loadVentesByPompeSuccess, (state, { response }) => ({ 
    ...state, 
    ventes: response.content,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    loading: false 
  })),
  on(VentesActions.loadVentesByPompeFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Load Stats
  on(VentesActions.loadVentesStats, state => ({ ...state, statsLoading: true, error: null })),
  on(VentesActions.loadVentesStatsSuccess, (state, { totalQuantite, totalMontant }) => ({ 
    ...state, 
    stats: { totalQuantite, totalMontant },
    statsLoading: false 
  })),
  on(VentesActions.loadVentesStatsFailure, (state, { error }) => ({ ...state, error, statsLoading: false }))
);
