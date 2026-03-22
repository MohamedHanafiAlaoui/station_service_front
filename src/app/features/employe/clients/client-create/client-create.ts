import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import * as ClientsActions from '../../store/clients/clients.actions';
import { selectClientsActionLoading } from '../../store/clients/clients.selectors';
import { Observable } from 'rxjs';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputFieldComponent],
  templateUrl: './client-create.html',
  styleUrl: './client-create.css'
})
export class ClientCreate {
  clientForm: FormGroup;
  loading$: Observable<boolean>;
  constructor(private fb: FormBuilder, private store: Store) {
    this.loading$ = this.store.select(selectClientsActionLoading);
    this.clientForm = this.fb.group({
      nom:       ['', [Validators.required, Validators.minLength(2)]],
      prenom:    ['', [Validators.required, Validators.minLength(2)]],
      username:  ['', [Validators.required, Validators.minLength(3)]],
      badgeRFID: ['', [Validators.required]]
    });
  }
  onSubmit(): void {
    if (this.clientForm.valid) {
      this.store.dispatch(ClientsActions.createClient({ client: this.clientForm.value }));
    }
  }
}