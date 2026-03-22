import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VenteService } from '../../../core/services/vente.service';
import { StationService } from '../../../core/services/station';
import { ToastService } from '../../../core/services/toast.service';
import { Station } from '../../../core/models/station';
@Component({
  selector: 'app-ventes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventes.html',
  styleUrl: './ventes.css',
})
export class Ventes implements OnInit {
  private readonly venteService = inject(VenteService);
  private readonly stationService = inject(StationService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  stations: Station[] = [];
  ventes: any[] = [];
  pagedVentes: any[] = [];
  isLoading = false;
  filterForm: FormGroup;
  totalMontant = 0;
  totalQuantite = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  isDrawerOpen = false;
  selectedVente: any = null;
  constructor() {
    this.filterForm = this.fb.group({
      stationId: [''],
      startDate: [new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]],
      endDate: [new Date().toISOString().split('T')[0]]
    });
  }
  ngOnInit(): void {
    this.loadStations();
    this.filterForm.get('stationId')?.valueChanges.subscribe(stationId => {
      if (stationId) {
        this.loadVentes();
      }
    });
  }
  private updatePagedItems(): void {
    this.totalPages = Math.max(1, Math.ceil(this.ventes.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedVentes = this.ventes.slice(start, start + this.pageSize);
  }
  loadStations(): void {
    this.stationService.getAllStations().subscribe({
      next: (data) => {
        this.stations = data;
        if (this.stations.length > 0) {
          this.filterForm.patchValue({ stationId: this.stations[0].id });
        }
      },
      error: () => this.toast.error('Erreur lors du chargement des stations')
    });
  }
  loadVentes(): void {
    const { stationId, startDate, endDate } = this.filterForm.value;
    if (!stationId) return;
    this.isLoading = true;
    this.venteService.getVentesByStation(
      stationId, 
      startDate,
      endDate,
      { page: 0, size: 500 } 
    ).subscribe({
      next: (data) => {
        const rawVentes = data.content ? data.content : data;
        this.ventes = this.mapVentes(rawVentes);
        console.log('>>> Ventes loaded:', this.ventes.length, 'records');
        this.currentPage = 1;
        this.updatePagedItems();
        this.isLoading = false;
        this.loadAggregations(stationId, startDate, endDate);
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Erreur lors du chargement des ventes');
        this.isLoading = false;
        this.ventes = [];
        this.updatePagedItems();
      }
    });
  }
  loadAggregations(stationId: number, start: string, end: string): void {
      this.venteService.getTotalMontantByStation(stationId, start, end).subscribe(res => {
          console.log('>>> Total Montant response:', res);
          this.totalMontant = res || 0;
      });
      this.venteService.getTotalQuantiteByStation(stationId, start, end).subscribe(res => {
          console.log('>>> Total Quantite response:', res);
          this.totalQuantite = res || 0;
      });
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedItems();
    }
  }
  openDrawer(vente: any): void {
    this.selectedVente = vente;
    this.isDrawerOpen = true;
  }
  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedVente = null;
  }
  private mapVentes(ventes: any[]): any[] {
    return ventes.map(v => ({
      ...v,
      date: new Date(v.dateVente).toLocaleString(),
      clientName: v.client ? `${v.client.prenom} ${v.client.nom}` : 'Direct Sale',
      pompeCode: v.pompe ? `P${v.pompe.codePompe}` : 'N/A'
    }));
  }
  refreshData(): void {
      this.loadVentes();
  }
}