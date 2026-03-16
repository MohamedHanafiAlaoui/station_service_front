import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BadgeState } from './badge.reducer';

export const selectBadgeState = createFeatureSelector<BadgeState>('badge');

export const selectBadgeSelling = createSelector(
  selectBadgeState,
  (state: BadgeState) => state.selling
);

export const selectBadgeError = createSelector(
  selectBadgeState,
  (state: BadgeState) => state.error
);

export const selectBadgeLastSaleSuccess = createSelector(
  selectBadgeState,
  (state: BadgeState) => state.lastSaleSuccess
);
