import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { PompeService } from '../../../core/services/pompe.service';
import { StationService } from '../../../core/services/station';
import { ToastService } from '../../../core/services/toast.service';
import { Pompe } from '../../../core/models/pompe';
import { Station } from '../../../core/models/station';
import { PompeTableComponent } from './components/pompe-table/pompe-table.component';
import { PompeFormComponent } from './components/pompe-form/pompe-form.component';
import { PompeDrawerComponent } from './components/pompe-drawer/pompe-drawer.component';
@Component({
  selector: 'app-pompes',
  standalone: true,
  imports: [CommonModule, PompeTableComponent, PompeFormComponent, PompeDrawerComponent],
  templateUrl: './pompes.html',
  styleUrl: './pompes.css',
})
export class Pompes implements OnInit {
  private readonly pompeService = inject(PompeService);
  private readonly stationService = inject(StationService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  pompes: Pompe[] = [];
  filteredPompes: Pompe[] = [];
  pagedPompes: Pompe[] = [];
  stations: Station[] = [];
  isLoading = false;
  searchQuery = '';
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  isDrawerOpen = false;
  selectedPompe: Pompe | null = null;
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  ngOnInit(): void {
    this.loadPompes();
    this.loadStationsForSelect();
  }
  private updatePagedItems(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredPompes.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedPompes = this.filteredPompes.slice(start, start + this.pageSize);
  }
  loadPompes(): void {
    this.isLoading = true;
    this.pompeService.getAllPompes().subscribe({
      next: (data) => {
        this.pompes = data;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Impossible de charger les pompes');
        this.isLoading = false;
      }
    });
  }
  loadStationsForSelect(): void {
    this.stationService.getAllStations().subscribe({
      next: (data) => this.stations = data.filter(s => s.active !== false),
      error: () => this.toast.error('Impossible de charger les stations')
    });
  }
  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }
  setFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  applyFilters(): void {
    let filtered = [...this.pompes];
    if (this.statusFilter === 'ACTIVE') filtered = filtered.filter(p => p.enService === true);
    else if (this.statusFilter === 'INACTIVE') filtered = filtered.filter(p => p.enService === false);
    if (this.searchQuery) {
      const q = this.searchQuery;
      filtered = filtered.filter(p =>
        p.codePompe.toLowerCase().includes(q) || 
        p.typeCarburant.toLowerCase().includes(q)
      );
    }
    this.filteredPompes = filtered;
    this.currentPage = 1;
    this.updatePagedItems();
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedItems();
    }
  }
  openDrawer(pompe: Pompe): void {
    this.selectedPompe = pompe;
    this.isDrawerOpen = true;
  }
  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedPompe = null;
  }
  openModal(mode: 'create' | 'edit', pompe?: Pompe): void {
    this.modalMode = mode;
    this.selectedPompe = pompe || null;
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
  }
  onFormSubmit(pompeData: any): void {
    if (this.modalMode === 'create') {
      this.pompeService.createPompe(pompeData).subscribe({
        next: (created) => {
          this.toast.success('Pompe créée avec succès : ' + created.codePompe);
          this.closeModal();
          this.loadPompes();
        },
        error: () => this.toast.error('Échec de la création')
      });
    } else if (this.modalMode === 'edit' && this.selectedPompe?.id) {
      this.pompeService.updatePompe(this.selectedPompe.id, pompeData).subscribe({
        next: () => {
          this.toast.success('Pompe mise à jour');
          this.closeModal();
          this.loadPompes();
        },
        error: () => this.toast.error('Échec de la mise à jour')
      });
    }
  }
  deletePompe(id: number): void {
    Swal.fire({
      title: 'Désactiver la pompe ?',
      text: "La pompe ne sera plus disponible pour les ventes.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Oui, désactiver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pompeService.deletePompe(id, false).subscribe({
          next: () => {
            this.toast.success('Pompe désactivée');
            this.loadPompes();
          },
          error: () => this.toast.error('Échec de la désactivation')
        });
      }
    });
  }
  restorePompe(id: number): void {
    Swal.fire({
      title: 'Réactiver la pompe ?',
      text: "La pompe redeviendra disponible pour les ventes.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Oui, réactiver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pompeService.deletePompe(id, true).subscribe({
          next: () => {
             this.toast.success('Pompe réactivée');
             this.loadPompes();
          },
          error: () => this.toast.error('Échec de la réactivation')
        });
      }
    });
  }
}