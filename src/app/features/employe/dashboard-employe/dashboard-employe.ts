import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/Auth';

// Selectors
import { selectAllPompes, selectPompesLoading } from '../store/pompes/pompes.selectors';
import { selectVentesStats, selectVentesStatsLoading } from '../store/ventes/ventes.selectors';
import { selectAllClients } from '../store/clients/clients.selectors';

// Actions
import * as PompesActions from '../store/pompes/pompes.actions';
import * as VentesActions from '../store/ventes/ventes.actions';
import * as ClientsActions from '../store/clients/clients.actions';

// Models
import { Pompe } from '../../../core/models/pompe';
import { Router, RouterModule } from '@angular/router';

import { CardComponent } from '../../../shared/components/card/card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BadgeService } from '../../../core/services/badge.service';

@Component({
  selector: 'app-dashboard-employe',
  standalone: true,
  imports: [CommonModule, CardComponent, LoadingSpinnerComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './dashboard-employe.html',
  styleUrl: './dashboard-employe.css',
})
export class DashboardEmploye implements OnInit {
  stationId: number | null = null;
  employeeName: string = '';

  pompes$: Observable<Pompe[]>;
  pompesLoading$: Observable<boolean>;

  ventesStats$: Observable<{ totalQuantite: number; totalMontant: number }>;
  ventesLoading$: Observable<boolean>;
  
  clients$: Observable<any[]>;

  quickSaleForm: FormGroup;
  quickSaleLoading = false;
  quickSaleSuccess = false;
  quickSaleError: string | null = null;

  constructor(
    private store: Store,
    private authService: AuthService,
    private fb: FormBuilder,
    private badgeService: BadgeService
  ) {
    this.quickSaleForm = this.fb.group({
      pompeId: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0.1)]],
      badgeCode: ['', [Validators.required]]
    });
    this.pompes$ = this.store.select(selectAllPompes);
    this.pompesLoading$ = this.store.select(selectPompesLoading);

    this.ventesStats$ = this.store.select(selectVentesStats);
    this.ventesLoading$ = this.store.select(selectVentesStatsLoading);
    
    this.clients$ = this.store.select(selectAllClients);
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.employeeName = `${user.nom} ${user.prenom}`;
      // In a real scenario, the station ID would be attached to the user/employe profile
      // For now, assuming stationId = 1 for the mockup
      this.stationId = 1;

      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    if (!this.stationId) return;

    // Load Pompes
    this.store.dispatch(PompesActions.loadPompesByStation({ stationId: this.stationId }));

    // Load Ventes Stats for today
    const today = new Date().toISOString().split('T')[0];
    this.store.dispatch(VentesActions.loadVentesStats({ 
      stationId: this.stationId, 
      start: today, 
      end: today 
    }));
    
    // Load Clients
    this.store.dispatch(ClientsActions.loadClients());
  }

  getFuelLevelPercentage(pompe: Pompe): number {
    // Mock capacity
    const capacity = 5000;
    // We don't have current level in Pompe model, so mock it based on ID
    return Math.min(100, Math.max(0, ((pompe.id || 1) * 1500 / capacity) * 100)); 
  }

  getPumpCapacity(): number {
    return 5000;
  }
  
  getPumpCurrentLevel(pompe: Pompe): number {
    return (pompe.id || 1) * 1500;
  }

  onQuickSaleSubmit(): void {
    if (this.quickSaleForm.valid) {
      this.quickSaleLoading = true;
      this.quickSaleError = null;
      this.quickSaleSuccess = false;

      this.badgeService.sellFuel(this.quickSaleForm.value).subscribe({
        next: () => {
          this.quickSaleLoading = false;
          this.quickSaleSuccess = true;
          this.quickSaleForm.reset();
          // Reload stats to show the new sale
          this.loadDashboardData();
        },
        error: (err) => {
          this.quickSaleLoading = false;
          this.quickSaleError = err.error?.message || err.message || 'Transaction failed.';
        }
      });
    }
  }
}
