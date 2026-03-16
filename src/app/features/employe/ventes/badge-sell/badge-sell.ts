import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BadgeService } from '../../../../core/services/badge.service';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllPompes } from '../../store/pompes/pompes.selectors';
import * as PompesActions from '../../store/pompes/pompes.actions';
import { Pompe } from '../../../../core/models/pompe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-badge-sell',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, RouterModule],
  templateUrl: './badge-sell.html',
  styleUrl: './badge-sell.css'
})
export class BadgeSell {
  sellForm: FormGroup;
  loading = false;
  success = false;
  error: string | null = null;
  pompes$: Observable<Pompe[]>;

  constructor(
    private fb: FormBuilder,
    private badgeService: BadgeService,
    private router: Router,
    private store: Store
  ) {
    this.pompes$ = this.store.select(selectAllPompes);
    this.sellForm = this.fb.group({
      badgeCode: ['', [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0.1)]],
      pompeId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(PompesActions.loadPompesByStation({ stationId: 1 }));
  }

  onSubmit(): void {
    if (this.sellForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = false;
      
      this.badgeService.sellFuel(this.sellForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.sellForm.reset();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'Transaction failed. Check balance or RFID code.';
        }
      });
    }
  }
}
