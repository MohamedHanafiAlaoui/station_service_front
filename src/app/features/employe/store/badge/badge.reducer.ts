import { createReducer, on } from '@ngrx/store';
import * as BadgeActions from './badge.actions';
export interface BadgeState {
  selling: boolean;
  error: string | null;
  lastSaleSuccess: boolean;
}
export const initialBadgeState: BadgeState = {
  selling: false,
  error: null,
  lastSaleSuccess: false
};
export const badgeReducer = createReducer(
  initialBadgeState,
  on(BadgeActions.sellFuelWithBadge, state => ({ ...state, selling: true, error: null, lastSaleSuccess: false })),
  on(BadgeActions.sellFuelWithBadgeSuccess, state => ({ ...state, selling: false, lastSaleSuccess: true })),
  on(BadgeActions.sellFuelWithBadgeFailure, (state, { error }) => ({ ...state, selling: false, error, lastSaleSuccess: false }))
);