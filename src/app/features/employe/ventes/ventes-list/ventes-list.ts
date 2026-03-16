import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import * as VentesActions from '../../store/ventes/ventes.actions';
import { selectAllVentes, selectVentesLoading, selectVentesError, selectVentesPagination } from '../../store/ventes/ventes.selectors';
import { Vente } from '../../../../core/models/vente';

import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-ventes-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, TableComponent],
  templateUrl: './ventes-list.html',
  styleUrl: './ventes-list.css',
})
export class VentesList implements OnInit {
  ventes$: Observable<Vente[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  pagination$: Observable<{ totalElements: number; totalPages: number }>;

  stationId: number | null = null;
  filterForm: FormGroup;

  tableColumns = [
    { field: 'id', header: 'Sale ID' },
    { field: 'date', header: 'Date & Time' },
    { field: 'quantite', header: 'Quantity (L)' },
    { field: 'prixUnitaire', header: 'Unit Price (MAD)' },
    { field: 'montantTotal', header: 'Total (MAD)' },
    { field: 'pompeInfo', header: 'Pump' },
    { field: 'clientInfo', header: 'Client' },
    { field: 'typePaiement', header: 'Payment Type' }
  ];

  constructor(private store: Store, private fb: FormBuilder) {
    this.ventes$ = this.store.select(selectAllVentes);
    this.loading$ = this.store.select(selectVentesLoading);
    this.error$ = this.store.select(selectVentesError);
    this.pagination$ = this.store.select(selectVentesPagination);

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filterForm = this.fb.group({
      startDate: [startOfMonth.toISOString().split('T')[0]],
      endDate: [today.toISOString().split('T')[0]]
    });
  }

  ngOnInit(): void {
    this.stationId = 1; // Assuming for mockup
    this.loadVentes();
  }

  loadVentes(page = 0): void {
    if (!this.stationId) return;

    const { startDate, endDate } = this.filterForm.value;
    const pageable = { page, size: 20, sort: 'dateVente,desc' };

    this.store.dispatch(VentesActions.loadVentes({
      stationId: this.stationId,
      start: startDate,
      end: endDate,
      pageable
    }));
  }

  onFilter(): void {
    this.loadVentes(0);
  }

  getMappedData(data: Vente[]): any[] {
    return data.map(item => ({
      ...item,
      date: new Date(item.dateVente || '').toLocaleString(),
      montantTotal: Number(item.montant || 0).toFixed(2),
      prixUnitaire: Number((item.montant || 0) / (item.quantite || 1)).toFixed(2),
      pompeInfo: item.pompe ? `P${item.pompe.codePompe} (${item.pompe.typeCarburant})` : 'N/A',
      clientInfo: item.client ? `${item.client.prenom} ${item.client.nom}` : 'Direct Sale',
      typePaiement: 'Unknown' // Not in model
    }));
  }
}
