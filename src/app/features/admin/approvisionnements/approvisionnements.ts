import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApprovisionnementService } from '../../../core/services/approvisionnement.service';
import { StationService } from '../../../core/services/station';
import { ToastService } from '../../../core/services/toast.service';
import { Station } from '../../../core/models/station';
@Component({
  selector: 'app-approvisionnements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './approvisionnements.html',
  styleUrl: './approvisionnements.css',
})
export class Approvisionnements implements OnInit {
  private readonly approvisionnementService = inject(ApprovisionnementService);
  private readonly stationService = inject(StationService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  stations: Station[] = [];
  approvisionnements: any[] = [];
  pagedApprovisionnements: any[] = [];
  isLoading = false;
  filterForm: FormGroup;
  totalVolume = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  isDrawerOpen = false;
  selectedApp: any = null;
  constructor() {
    this.filterForm = this.fb.group({
      stationId: ['']
    });
  }
  ngOnInit(): void {
    this.loadStations();
    this.filterForm.get('stationId')?.valueChanges.subscribe(stationId => {
      if (stationId) {
        this.loadApprovisionnements(+stationId);
      }
    });
  }
  private updatePagedItems(): void {
    this.totalPages = Math.max(1, Math.ceil(this.approvisionnements.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedApprovisionnements = this.approvisionnements.slice(start, start + this.pageSize);
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
  loadApprovisionnements(stationId: number): void {
    this.isLoading = true;
    this.approvisionnementService.getApprovisionnementsByStation(stationId).subscribe({
      next: (data) => {
        this.approvisionnements = this.mapApprovisionnements(data).reverse(); 
        this.currentPage = 1;
        this.updatePagedItems();
        this.totalVolume = this.approvisionnements.reduce((sum, app) => sum + (app.quantiteAjoutee || 0), 0);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Erreur lors du chargement des approvisionnements');
        this.isLoading = false;
        this.approvisionnements = [];
        this.updatePagedItems();
        this.totalVolume = 0;
      }
    });
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedItems();
    }
  }
  openDrawer(app: any): void {
    this.selectedApp = app;
    this.isDrawerOpen = true;
  }
  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedApp = null;
  }
  private mapApprovisionnements(apps: any[]): any[] {
    console.log('Mapping approvisionnements:', apps);
    return apps.map(app => ({
      ...app,
      dateFormatted: app.dateApprovisionnement ? new Date(app.dateApprovisionnement).toLocaleDateString() + ' ' + new Date(app.dateApprovisionnement).toLocaleTimeString() : 'N/A',
      quantiteAjoutee: app.quantite || 0,
      niveauApres: app.niveauApres || 0,
      pompeInfo: app.pompe ? `P${app.pompe.codePompe}` : 'ST-SUPPLY',
      stationName: this.stations.find(s => s.id === app.stationId)?.nom || `Station ${app.stationId}`
    }));
  }
}