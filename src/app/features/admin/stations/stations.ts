import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StationService } from '../../../core/services/station';
import { ToastService } from '../../../core/services/toast.service';
import { Station } from '../../../core/models/station';
@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stations.html',
  styleUrl: './stations.css',
})
export class Stations implements OnInit {
  private readonly stationService = inject(StationService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  stations: Station[] = [];
  filteredStations: Station[] = [];
  pagedStations: Station[] = [];
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
  selectedStation: Station | null = null;
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  stationForm: FormGroup;
  selectedStationId?: number;
  constructor() {
    this.stationForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      active: [true],
      latitude: [0],
      longitude: [0]
    });
  }
  ngOnInit(): void {
    this.loadStations();
  }
  private updatePagedItems(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredStations.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedStations = this.filteredStations.slice(start, start + this.pageSize);
  }
  loadStations(): void {
    this.isLoading = true;
    this.stationService.getAllStations().subscribe({
      next: (data) => {
        this.stations = data;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Impossible de charger les stations');
        this.isLoading = false;
      }
    });
  }
  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = query;
    this.applyFilters();
  }
  setFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  applyFilters(): void {
    let filtered = [...this.stations];
    if (this.statusFilter === 'ACTIVE') {
      filtered = filtered.filter(s => s.active === true);
    } else if (this.statusFilter === 'INACTIVE') {
      filtered = filtered.filter(s => s.active === false);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.nom.toLowerCase().includes(q) || 
        s.adresse.toLowerCase().includes(q)
      );
    }
    this.filteredStations = filtered;
    this.currentPage = 1;
    this.updatePagedItems();
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedItems();
    }
  }
  openDrawer(station: Station): void {
    this.selectedStation = station;
    this.isDrawerOpen = true;
  }
  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedStation = null;
  }
  openModal(mode: 'create' | 'edit', station?: Station): void {
    this.modalMode = mode;
    this.isModalOpen = true;
    if (mode === 'edit' && station) {
      this.selectedStationId = station.id;
      this.stationForm.patchValue({
        nom: station.nom,
        adresse: station.adresse,
        active: station.active ?? true,
        latitude: station.latitude ?? 0,
        longitude: station.longitude ?? 0
      });
    } else {
      this.selectedStationId = undefined;
      this.stationForm.reset({ active: true, latitude: 0, longitude: 0 });
    }
  }
  closeModal(): void {
    this.isModalOpen = false;
    this.stationForm.reset();
  }
  onSubmit(): void {
    if (this.stationForm.invalid) return;
    const stationData: Station = this.stationForm.value;
    if (this.modalMode === 'create') {
      this.stationService.createStation(stationData).subscribe({
        next: () => {
          this.toast.success('Station créée avec succès');
          this.closeModal();
          this.loadStations();
        },
        error: () => this.toast.error('Échec de la création')
      });
    } else if (this.modalMode === 'edit' && this.selectedStationId) {
      this.stationService.updateStation(this.selectedStationId, stationData).subscribe({
        next: () => {
          this.toast.success('Station mise à jour');
          this.closeModal();
          this.loadStations();
        },
        error: () => this.toast.error('Échec de la mise à jour')
      });
    }
  }
  deleteStation(id: number | undefined): void {
    if (!id) return;
    Swal.fire({
      title: 'Désactiver la station ?',
      text: "La station ne sera plus opérationnelle dans le système.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Oui, désactiver',
      cancelButtonText: 'Annuler',
      background: '#ffffff',
      color: '#1e293b'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stationService.deleteStation(id, false).subscribe({
          next: () => {
            Swal.fire({
              title: 'Désactivée !',
              text: 'La station a été mise hors service.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadStations();
          },
          error: () => this.toast.error('Échec de la désactivation')
        });
      }
    });
  }
  restoreStation(id: number | undefined): void {
    if (!id) return;
    Swal.fire({
      title: 'Réactiver la station ?',
      text: "La station redeviendra opérationnelle.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Oui, réactiver',
      cancelButtonText: 'Annuler',
      background: '#ffffff',
      color: '#1e293b'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stationService.deleteStation(id, true).subscribe({
          next: () => {
            Swal.fire({
              title: 'Réactivée !',
              text: 'La station est de nouveau opérationnelle.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadStations();
          },
          error: () => this.toast.error('Échec de la réactivation')
        });
      }
    });
  }
}