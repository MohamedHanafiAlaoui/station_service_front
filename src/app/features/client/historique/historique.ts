import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadHistorique } from '../store/client.actions';
import { selectHistorique, selectLoading, selectError } from '../store/client.selectors';
import { AuthService } from '../../../core/services/Auth';
import { StationService } from '../../../core/services/station';
import { Station } from '../../../core/models/station';
import { VenteService } from '../../../core/services/vente.service';
@Component({
  selector: 'client-historique',
  standalone: true,
  imports: [AsyncPipe, DatePipe, FormsModule],
  templateUrl: './historique.html',
  styleUrl: './historique.css',
})
export class Historique {
  private store = inject(Store);
  private auth = inject(AuthService);
  private stationService = inject(StationService);
  private vent =inject(VenteService) ;
  historique$ = this.store.select(selectHistorique);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  stations: Station[] = [];
  monven: number = 0;
  filters = {
    start: '2020-01-01T00:00:00',
    end: '2030-01-01T00:00:00',
    minQuantite: null as number | null,
  };
  ngOnInit() {
    const clientId = this.auth.getUserId();
    if (!clientId) return;
    this.loadStations();
    this.store.dispatch(loadHistorique({
      clientId,
      start: this.filters.start,
      end: this.filters.end,
      pageable: { page: 0, size: 20 }
    }));
    this.vent.getclientvent(clientId).subscribe({
      next:(value)=>this.monven=value,
      error:(e)=>console.error(e)
    })
  
  }
  loadStations() {
    this.stationService.getAllStations().subscribe({
      next: (stations) => this.stations = stations,
      error: (err) => console.error('Erreur chargement stations', err)
    });
  }
  getStationName(stationId?: number): string {
    if (!stationId) return 'Station Inconnue';
    const s = this.stations.find(st => st.id === stationId);
    return s ? s.nom : `Station #${stationId}`;
  }
  getStationAddress(stationId?: number): string {
    if (!stationId) return 'Adresse non disponible';
    const s = this.stations.find(st => st.id === stationId);
    return s ? s.adresse : 'Chargement...';
  }
  applyFilters() {
    const clientId = this.auth.getUserId();
    if (!clientId) return;
    this.store.dispatch(loadHistorique({
      clientId,
      start: this.filters.start,
      end: this.filters.end,
      pageable: { page: 0, size: 20 },
      minQuantite: this.filters.minQuantite ?? undefined,
    }));
  }

  


}