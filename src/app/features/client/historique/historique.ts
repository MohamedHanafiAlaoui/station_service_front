import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadHistorique } from '../store/client.actions';
import { selectHistorique, selectLoading, selectError } from '../store/client.selectors';
import { AuthService } from '../../../core/services/Auth';

@Component({
  selector: 'client-historique',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './historique.html',
  styleUrl: './historique.css',
})
export class Historique {

  private store = inject(Store);
  private auth = inject(AuthService);

  historique$ = this.store.select(selectHistorique);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  filters = {
    start: '2020-01-01T00:00:00',
    end: '2030-01-01T00:00:00',
    minQuantite: null as number | null,
  };

  ngOnInit() {
    const clientId = this.auth.getUserId();
    if (!clientId) return;

    this.store.dispatch(loadHistorique({
      clientId,
      start: this.filters.start,
      end: this.filters.end,
      pageable: { page: 0, size: 20 }
    }));
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
