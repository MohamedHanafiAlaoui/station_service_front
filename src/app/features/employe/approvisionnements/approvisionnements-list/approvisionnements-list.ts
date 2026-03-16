import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as ApprovisionnementsActions from '../../store/approvisionnements/approvisionnements.actions';
import { selectAllApprovisionnements, selectApprovisionnementsLoading, selectApprovisionnementsError } from '../../store/approvisionnements/approvisionnements.selectors';
import { Approvisionnement } from '../../../../core/models/approvisionnement';

import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-approvisionnements-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, TableComponent],
  templateUrl: './approvisionnements-list.html',
  styleUrl: './approvisionnements-list.css',
})
export class ApprovisionnementsList implements OnInit {
  approvisionnements$: Observable<Approvisionnement[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  stationId: number | null = null;

  tableColumns = [
    { field: 'id', header: 'ID' },
    { field: 'dateAppro', header: 'Scheduled Date' },
    { field: 'quantite', header: 'Quantity (L)' },
    { field: 'fournisseur', header: 'Supplier' },
    { field: 'status', header: 'Status' } // Not in model
  ];

  constructor(private store: Store) {
    this.approvisionnements$ = this.store.select(selectAllApprovisionnements);
    this.loading$ = this.store.select(selectApprovisionnementsLoading);
    this.error$ = this.store.select(selectApprovisionnementsError);
  }

  ngOnInit(): void {
    this.stationId = 1; // Assuming for mockup
    if (this.stationId) {
      this.store.dispatch(ApprovisionnementsActions.loadApprovisionnements({ stationId: this.stationId }));
    }
  }

  getMappedData(data: Approvisionnement[]): any[] {
    return data.map(item => ({
      ...item,
      dateAppro: new Date(item.dateAppro || '').toLocaleDateString(),
      fournisseur: item.fournisseur || 'Unknown',
      status: 'Completed' // Not in model
    }));
  }
}
