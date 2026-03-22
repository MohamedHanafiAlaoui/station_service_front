import { createReducer, on } from '@ngrx/store';
import * as JournalActions from './journal.actions';
import { Journal } from '../../../../core/models/journal';
export interface JournalState {
  journals: Journal[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}
export const initialJournalState: JournalState = {
  journals: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null
};
export const journalReducer = createReducer(
  initialJournalState,
  on(JournalActions.loadJournals, state => ({ ...state, loading: true, error: null })),
  on(JournalActions.loadJournalsSuccess, (state, { response }) => ({ 
    ...state, 
    journals: response.content, 
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    loading: false 
  })),
  on(JournalActions.loadJournalsFailure, (state, { error }) => ({ ...state, error, loading: false }))
);