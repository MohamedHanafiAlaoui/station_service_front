import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectClient, selectLoading, selectError } from '../store/client.selectors';
import { loadClient, updateClientName,  } from '../store/client.actions';
import { AuthService } from '../../../core/services/Auth';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user';

@Component({
  selector: 'client-profil',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {

  private store = inject(Store);
  private auth = inject(AuthService);

  client$ = this.store.select(selectClient);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  editMode = false;

  form = {
    nom: '',
    prenom: ''
  };

  ngOnInit() {
    const clientId = this.auth.getUserId();

    if (!clientId) {
      console.error("Aucun client connecté");
      return;
    }

    this.store.dispatch(loadClient({ id: clientId }));

    this.client$.subscribe(client => {
      if (client) {
        this.form.nom = client.nom;
        this.form.prenom = client.prenom;
      }
    });
  }

  save() {
    const clientId = this.auth.getUserId()!;

    this.store.dispatch(updateClientName({
      id: clientId,
      nom: this.form.nom,
      prenom: this.form.prenom
    }));

    this.editMode = false;
  }
}
