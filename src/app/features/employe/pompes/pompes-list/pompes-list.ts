import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/Auth';
import * as PompesActions from '../../store/pompes/pompes.actions';
import { selectAllPompes, selectPompesLoading, selectPompesError } from '../../store/pompes/pompes.selectors';
import { Pompe } from '../../../../core/models/pompe';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-pompes-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './pompes-list.html',
  styleUrl: './pompes-list.css',
})
export class PompesList implements OnInit {
  pompes$: Observable<Pompe[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  stationId: number | null = null;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    this.pompes$ = this.store.select(selectAllPompes);
    this.loading$ = this.store.select(selectPompesLoading);
    this.error$ = this.store.select(selectPompesError);
  }

  ngOnInit(): void {
    this.stationId = this.authService.getStationId();
    if (this.stationId) {
      this.store.dispatch(PompesActions.loadPompesByStation({ stationId: this.stationId }));
    }
  }

  navigateToAddFuel(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/employe/pompes', id, 'add-fuel']);
    }
  }

  navigateToDetails(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/employe/pompes', id, 'details']);
    }
  }
  handleAction(event: { action: string; row: any }): void {
    const pompeId = event.row.id;
    if (event.action === 'add-fuel') {
      this.router.navigate(['/employe/pompes', pompeId, 'add-fuel']);
    } else if (event.action === 'details') {
      this.router.navigate(['/employe/pompes', pompeId, 'details']);
    }
  }
  getFuelLevelPercentage(pompe: Pompe): number {
    if (!pompe.capaciteMax || pompe.capaciteMax === 0) return 0;
    return Math.round((pompe.niveauActuel / pompe.capaciteMax) * 100);
  }

  isLevelLow(pompe: Pompe): boolean {
    const threshold = pompe.seuilAlerte || 100;
    return pompe.niveauActuel <= threshold;
  }
}