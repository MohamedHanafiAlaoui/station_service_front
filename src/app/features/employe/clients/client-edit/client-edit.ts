import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import * as ClientsActions from '../../store/clients/clients.actions';
import { selectAllClients, selectClientsActionLoading } from '../../store/clients/clients.selectors';
import { Observable, take } from 'rxjs';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { ClientDto } from '../../../../core/models/client';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputFieldComponent],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.css'
})
export class ClientEdit implements OnInit {
  clientForm: FormGroup;
  loading$: Observable<boolean>;
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.loading$ = this.store.select(selectClientsActionLoading);
    this.clientForm = this.fb.group({
      nom:       ['', [Validators.required, Validators.minLength(2)]],
      prenom:    ['', [Validators.required, Validators.minLength(2)]],
      username:  ['', [Validators.required, Validators.minLength(3)]],
      badgeRFID: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId = +id;
      // Pre-fill the form from the store (clients already loaded by ClientsList)
      this.store.select(selectAllClients).pipe(take(1)).subscribe((clients: ClientDto[]) => {
        const client = clients.find(c => c.id === this.clientId);
        if (client) {
          this.clientForm.patchValue({
            nom:       client.nom,
            prenom:    client.prenom,
            username:  client.username,
            badgeRFID: client.badgeRFID
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid && this.clientId) {
      // Navigation is handled in ClientsEffects after updateClientSuccess
      this.store.dispatch(ClientsActions.updateClient({
        id: this.clientId,
        client: this.clientForm.value
      }));
    }
  }
}
