import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/Auth';
import { selectAllPompes, selectPompesLoading } from '../store/pompes/pompes.selectors';
import { selectVentesStats, selectVentesStatsLoading } from '../store/ventes/ventes.selectors';
import { selectAllClients } from '../store/clients/clients.selectors';
import * as PompesActions from '../store/pompes/pompes.actions';
import * as VentesActions from '../store/ventes/ventes.actions';
import * as ClientsActions from '../store/clients/clients.actions';
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
      this.stationId = this.authService.getStationId();
      this.loadDashboardData();
    }
  }
  loadDashboardData(): void {
    if (!this.stationId) return;
    this.store.dispatch(PompesActions.loadPompesByStation({ stationId: this.stationId }));
    const today = new Date().toISOString().split('T')[0];
    this.store.dispatch(VentesActions.loadVentesStats({ 
      stationId: this.stationId, 
      start: today, 
      end: today 
    }));
    this.store.dispatch(ClientsActions.loadClients());
  }
  getFuelLevelPercentage(pompe: Pompe): number {
    if (!pompe.capaciteMax || pompe.capaciteMax === 0) return 0;
    return Math.round((pompe.niveauActuel / pompe.capaciteMax) * 100);
  }
  getPumpCapacity(pompe: Pompe): number {
    return pompe.capaciteMax;
  }
  getPumpCurrentLevel(pompe: Pompe): number {
    return pompe.niveauActuel;
  }
  getAverageReserves(pompes: Pompe[]): number {
    if (!pompes || pompes.length === 0) return 0;
    const totalCurrent = pompes.reduce((acc, p) => acc + (p.niveauActuel || 0), 0);
    const totalCapacity = pompes.reduce((acc, p) => acc + (p.capaciteMax || 0), 0);
    if (totalCapacity === 0) return 0;
    return Math.round((totalCurrent / totalCapacity) * 100);
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