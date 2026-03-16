import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import * as PompesActions from '../../store/pompes/pompes.actions';
import { selectPompeById, selectPompesActionLoading, selectPompesError } from '../../store/pompes/pompes.selectors';
import { Pompe } from '../../../../core/models/pompe';

import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';

@Component({
  selector: 'app-pompes-add-fuel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './pompes-add-fuel.html',
  styleUrl: './pompes-add-fuel.css'
})
export class PompesAddFuel implements OnInit {
  pompeId!: number;
  pompe$: Observable<Pompe | undefined>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fuelForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.fuelForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]]
    });

    // Default init to avoid strict mode errors before ngOnInit
    this.pompe$ = new Observable();
    this.loading$ = this.store.select(selectPompesActionLoading);
    this.error$ = this.store.select(selectPompesError);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pompeId = +id;
        // Make sure pompes are loaded for the selector to work
        this.store.dispatch(PompesActions.loadPompesByStation({ stationId: 1 })); 
        this.pompe$ = this.store.select(selectPompeById(this.pompeId));
      } else {
        this.goBack();
      }
    });

    // Reset error on load
  }

  onSubmit(): void {
    if (this.fuelForm.valid && this.pompeId) {
      const quantity = this.fuelForm.value.quantity;
      this.store.dispatch(PompesActions.addFuel({ id: this.pompeId, quantity }));
      
      // Navigate back after a short delay (in a real app, listen to success action via effects/actions store)
      // For demonstration
      setTimeout(() => {
        this.goBack();
      }, 500);
    }
  }

  goBack(): void {
    this.router.navigate(['/employe/pompes']);
  }
}
