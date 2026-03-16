import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import * as ClientsActions from '../../store/clients/clients.actions';
import { selectClientById, selectClientsActionLoading, selectClientsError } from '../../store/clients/clients.selectors';

import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-clients-recharge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './clients-recharge.html',
  styleUrl: './clients-recharge.css'
})
export class ClientsRecharge implements OnInit {
  clientId!: number;
  client$: Observable<any>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  rechargeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.rechargeForm = this.fb.group({
      montant: [null, [Validators.required, Validators.min(10)]]
    });

    this.client$ = new Observable();
    this.loading$ = this.store.select(selectClientsActionLoading);
    this.error$ = this.store.select(selectClientsError);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.clientId = +id;
        this.client$ = this.store.select(selectClientById(this.clientId));
      } else {
        this.goBack();
      }
    });

    // Load clients to ensure state is populated
    this.store.dispatch(ClientsActions.loadClients());
  }

  onSubmit(): void {
    if (this.rechargeForm.valid && this.clientId) {
      const montant = this.rechargeForm.value.montant;
      this.store.dispatch(ClientsActions.rechargeClient({ id: this.clientId, montant }));
      
      // Simulate navigate after success
      setTimeout(() => {
        this.goBack();
      }, 500);
    }
  }

  goBack(): void {
    this.router.navigate(['/employe/clients']);
  }
}
