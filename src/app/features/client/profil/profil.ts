import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { selectClient, selectLoading, selectError } from '../store/client.selectors';
import { loadClient } from '../store/client.actions';
import { AuthService } from '../../../core/services/Auth';

@Component({
  selector: 'client-profil',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {

  private store = inject(Store);
  private auth = inject(AuthService);

  client$ = this.store.select(selectClient);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  ngOnInit() {
    const clientId = this.auth.getUserId();

    if (!clientId) {
      console.error("ما كاين حتى عميل متصل");
      return;
    }

    this.store.dispatch(loadClient({ id: clientId }));
  }
}
