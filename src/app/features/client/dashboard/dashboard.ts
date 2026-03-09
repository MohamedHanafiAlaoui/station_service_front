import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe} from '@angular/common';
import { loadClient, loadHistorique } from '../store/client.actions';
import { selectClient, selectError, selectHistorique, selectLoading } from '../store/client.selectors';
import { AuthService } from '../../../core/services/Auth';

@Component({
  selector: 'client-dashboard',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private store = inject(Store);
  private auth = inject(AuthService);

  client$ = this.store.select(selectClient);
  historique$ = this.store.select(selectHistorique);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

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