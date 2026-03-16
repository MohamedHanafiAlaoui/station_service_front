import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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

  // Pagination
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Detail Drawer
  isDrawerOpen = false;
  selectedStation: Station | null = null;

  // Modal State
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
        this.filteredStations = data;
        this.currentPage = 1;
        this.isLoading = false;
        this.updatePagedItems();
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
    if (query) {
      this.filteredStations = this.stations.filter(s =>
        s.nom.toLowerCase().includes(query) || s.adresse.toLowerCase().includes(query)
      );
    } else {
      this.filteredStations = this.stations;
    }
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

  toggleStatus(id: number | undefined, currentStatus: boolean | undefined): void {
    if (!id) return;
    this.stationService.deleteStation(id, !(currentStatus ?? false)).subscribe({
      next: () => {
        this.toast.success('Statut mis à jour');
        this.loadStations();
      },
      error: () => this.toast.error('Échec de la modification du statut')
    });
  }
}
