import { createAction, props } from '@ngrx/store';
import { Journal } from '../../../../core/models/journal';

export const loadJournals = createAction(
  '[Journal] Load Journals',
  props<{ stationId: number; start: string; end: string; pageable: any }>()
);

export const loadJournalsSuccess = createAction(
  '[Journal] Load Journals Success',
  props<{ response: any }>() // Page<Journal>
);

export const loadJournalsFailure = createAction(
  '[Journal] Load Journals Failure',
  props<{ error: string }>()
);
