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
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-pompes-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, TableComponent],
  templateUrl: './pompes-list.html',
  styleUrl: './pompes-list.css',
})
export class PompesList implements OnInit {
  pompes$: Observable<Pompe[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  stationId: number | null = null;

  tableColumns = [
    { field: 'numero', header: 'Pump ID' },
    { field: 'typeCarburant', header: 'Fuel Type' },
    { field: 'status', header: 'Status' } // Computed derived from level mock
  ];

  tableActions = [
    { id: 'add-fuel', label: 'Add Fuel', color: 'blue' },
    { id: 'details', label: 'View Details', color: 'slate' }
  ];

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
    // Hardcoded for demo
    this.stationId = 1;
    if (this.stationId) {
      this.store.dispatch(PompesActions.loadPompesByStation({ stationId: this.stationId }));
    }
  }

  // Inject computed fields for the table
  getMappedPompes(pompes: Pompe[]): any[] {
    return pompes.map(p => ({
      ...p,
      numero: `P${p.codePompe}`,
      status: this.getFuelLevelPercentage(p) > 20 ? 'Active' : 'Low Fuel'
    }));
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
    const capacity = 5000;
    return Math.min(100, Math.max(0, ((pompe.id || 1) * 1500 / capacity) * 100)); 
  }
}
