import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { selectClient, selectLoading, selectError } from '../store/client.selectors';
import { rechargeSolde, loadClient } from '../store/client.actions';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/Auth';

@Component({
  selector: 'client-solde',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './solde.html',
  styleUrl: './solde.css',
})
export class Solde {

  private store = inject(Store);
  private auth = inject(AuthService);

  client$ = this.store.select(selectClient);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  montant: number = 0;
  successMessage = '';

  ngOnInit() {
    const clientId = this.auth.getUserId();

    if (!clientId) {
      console.error("ما كاين حتى عميل متصل");
      return;
    }

    this.store.dispatch(loadClient({ id: clientId }));
  }

  onRecharge() {
    const clientId = this.auth.getUserId();

    if (!clientId) {
      console.error("ما كاين حتى عميل متصل");
      return;
    }

    this.successMessage = '';

    this.store.dispatch(rechargeSolde({ id: clientId, montant: this.montant }));

    // نعاود نجيب client باش يتحدّث solde
    setTimeout(() => {
      this.store.dispatch(loadClient({ id: clientId }));
      this.successMessage = 'Recharge effectuée avec succès !';
      this.montant = 0;
    }, 500);
  }
}
