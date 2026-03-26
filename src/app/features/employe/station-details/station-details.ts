import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Station } from '../../../core/models/station';
import * as StationActions from '../store/station/station.actions';
import { selectCurrentStation, selectStationLoading, selectStationError } from '../store/station/station.selectors';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../../core/services/Auth';
@Component({
  selector: 'app-station-details',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './station-details.html',
  styleUrl: './station-details.css',
})
export class StationDetails implements OnInit {
  station$: Observable<Station | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  constructor(private store: Store, private authService: AuthService) {
    this.station$ = this.store.select(selectCurrentStation);
    this.loading$ = this.store.select(selectStationLoading);
    this.error$ = this.store.select(selectStationError);
  }
  ngOnInit(): void {
    const stationId = this.authService.getStationId();
    if (stationId) {
      this.store.dispatch(StationActions.loadStation({ id: stationId }));
    }
  }
}