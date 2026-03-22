import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JournalState } from './journal.reducer';
export const selectJournalState = createFeatureSelector<JournalState>('journal');
export const selectAllJournals = createSelector(
  selectJournalState,
  (state: JournalState) => state.journals
);
export const selectJournalPagination = createSelector(
  selectJournalState,
  (state: JournalState) => ({
    totalElements: state.totalElements,
    totalPages: state.totalPages
  })
);
export const selectJournalLoading = createSelector(
  selectJournalState,
  (state: JournalState) => state.loading
);
export const selectJournalError = createSelector(
  selectJournalState,
  (state: JournalState) => state.error
);