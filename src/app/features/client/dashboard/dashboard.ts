import { Component, inject} from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe} from '@angular/common';
import { map } from 'rxjs';
import { loadClient, loadHistorique } from '../store/client.actions';
import { selectClient, selectError, selectHistorique, selectLoading } from '../store/client.selectors';
import { AuthService } from '../../../core/services/Auth';
import { StationService } from '../../../core/services/station';
import { StationMap } from '../../../shared/components/station-map/station-map';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot, faGasPump } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'client-dashboard',
  standalone: true,
  imports: [AsyncPipe, StationMap, FontAwesomeModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private store = inject(Store);
  private auth = inject(AuthService);
  private stationsService = inject(StationService);

  client$ = this.store.select(selectClient);
  historique$ = this.store.select(selectHistorique);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  stations$ = this.stationsService.getPublicStations();
  randomStations$ = this.stations$.pipe(
    map(stations => {
      if (!stations || stations.length <= 3) return stations;
      const copy = [...stations];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, 3);
    })
  );

  protected readonly faGasPump = faGasPump;
  protected readonly faLocationDot = faLocationDot;

  ngOnInit() {
    const clientId = this.auth.getUserId();

    if (!clientId) {
      console.error("ما كاين حتى عميل متصل");
      return;
    }

    this.loadClientData(clientId);
  }

  private loadClientData(clientId: number) {

    this.store.dispatch(loadClient({ id: clientId }));

    this.store.dispatch(loadHistorique({
      clientId,
      start: '2020-01-01T00:00:00',
      end: '2030-01-01T00:00:00',
      pageable: { page: 0, size: 5 }
    }));
  }
}