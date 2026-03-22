import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as PompesActions from '../../store/pompes/pompes.actions';
import { selectPompeById, selectPompesActionLoading, selectPompesError } from '../../store/pompes/pompes.selectors';
import { Pompe } from '../../../../core/models/pompe';
import { AuthService } from '../../../../core/services/Auth';
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
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.fuelForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
    this.pompe$ = new Observable();
    this.loading$ = this.store.select(selectPompesActionLoading);
    this.error$ = this.store.select(selectPompesError);
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pompeId = +id;
        const stationId = this.authService.getStationId();
        if (stationId) {
          this.store.dispatch(PompesActions.loadPompesByStation({ stationId })); 
        }
        this.pompe$ = this.store.select(selectPompeById(this.pompeId));
      } else {
        this.goBack();
      }
    });
  }
  onSubmit(): void {
    if (this.fuelForm.valid && this.pompeId) {
      const quantity = this.fuelForm.value.quantity;
      this.store.dispatch(PompesActions.addFuel({ id: this.pompeId, quantity }));
    }
  }
  goBack(): void {
    this.router.navigate(['/employe/pompes']);
  }
}