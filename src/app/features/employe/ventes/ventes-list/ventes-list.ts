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
import { AuthService } from '../../../../core/services/Auth';
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
    { field: 'id', header: 'ID Vente' },
    { field: 'date', header: 'Date & Heure' },
    { field: 'pompeInfo', header: 'Pompe' },
    { field: 'quantite', header: 'Quantité (L)' },
    { field: 'prixUnitaire', header: 'Prix/L (MAD)' },
    { field: 'montantTotal', header: 'Total (MAD)' },
    { field: 'typePaiement', header: 'Type' }
  ];
  constructor(private store: Store, private fb: FormBuilder, private authService: AuthService) {
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
    this.stationId = this.authService.getStationId();
    this.loadVentes();
  }
  loadVentes(page = 0): void {
    if (!this.stationId) return;
    const { startDate, endDate } = this.filterForm.value;
    const pageable = { page, size: 20, sort: 'dateVente,desc' };
    const startTimestamp = startDate ? `${startDate}T00:00:00` : '';
    const endTimestamp = endDate ? `${endDate}T23:59:59` : '';
    this.store.dispatch(VentesActions.loadVentes({
      stationId: this.stationId,
      start: startTimestamp,
      end: endTimestamp,
      pageable
    }));
  }
  onFilter(): void {
    this.loadVentes(0);
  }
  getMappedData(data: Vente[]): any[] {
    return data.map(item => ({
      ...item,
      date: new Date(item.dateVente || '').toLocaleString('fr-FR'),
      montantTotal: Number(item.montant || 0).toFixed(2),
      prixUnitaire: item.quantite > 0 ? Number((item.montant || 0) / item.quantite).toFixed(2) : '0.00',
      pompeInfo: item.pompe ? `Pompe ${item.pompe.codePompe}` : 'N/A',
      typePaiement: item.client ? 'Badge Client' : 'Espèces'  
    }));
  }
}