import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PompeService } from '../../../core/services/pompe.service';
import { StationService } from '../../../core/services/station';
import { ToastService } from '../../../core/services/toast.service';
import { Pompe } from '../../../core/models/pompe';
import { Station } from '../../../core/models/station';

@Component({
  selector: 'app-pompes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pompes.html',
  styleUrl: './pompes.css',
})
export class Pompes implements OnInit {
  private readonly pompeService = inject(PompeService);
  private readonly stationService = inject(StationService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  pompes: Pompe[] = [];
  filteredPompes: Pompe[] = [];
  pagedPompes: Pompe[] = [];
  stations: Station[] = [];
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
  selectedPompe: Pompe | null = null;

  // Modal State
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  pompeForm: FormGroup;
  selectedPompeId?: number;

  constructor() {
    this.pompeForm = this.fb.group({
      codePompe: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_-]{3,15}$/)]],
      typeCarburant: ['ESSENCE', [Validators.required]],
      capaciteMax: [1000, [Validators.required, Validators.min(1)]],
      niveauActuel: [0, [Validators.required, Validators.min(0)]],
      prixParLitre: [14.5, [Validators.required, Validators.min(0.01)]],
      enService: [true],
      stationId: ['', [Validators.required]]
    });
  }

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
        this.filteredPompes = data;
        this.currentPage = 1;
        this.isLoading = false;
        this.updatePagedItems();
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
      error: () => this.toast.error('Impossible de charger les stations pour le formulaire')
    });
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = query;
    if (query) {
      this.filteredPompes = this.pompes.filter(p =>
        p.codePompe.toLowerCase().includes(query) || p.typeCarburant.toLowerCase().includes(query)
      );
    } else {
      this.filteredPompes = this.pompes;
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
    this.isModalOpen = true;

    if (mode === 'edit' && pompe) {
      this.selectedPompeId = pompe.id;
      this.pompeForm.patchValue({
        codePompe: pompe.codePompe,
        typeCarburant: pompe.typeCarburant,
        capaciteMax: pompe.capaciteMax,
        niveauActuel: pompe.niveauActuel,
        prixParLitre: pompe.prixParLitre,
        enService: pompe.enService ?? true,
        stationId: pompe.stationId
      });
    } else {
      this.selectedPompeId = undefined;
      this.pompeForm.reset({
        typeCarburant: 'ESSENCE',
        capaciteMax: 1000,
        niveauActuel: 0,
        prixParLitre: 14.5,
        enService: true,
        stationId: ''
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.pompeForm.reset();
  }

  onSubmit(): void {
    if (this.pompeForm.invalid) return;

    const pompeData: Pompe = this.pompeForm.value;

    if (this.modalMode === 'create') {
      this.pompeService.createPompe(pompeData).subscribe({
        next: () => {
          this.toast.success('Pompe créée avec succès');
          this.closeModal();
          this.loadPompes();
        },
        error: () => this.toast.error('Échec de la création de la pompe')
      });
    } else if (this.modalMode === 'edit' && this.selectedPompeId) {
      this.pompeService.updatePompe(this.selectedPompeId, pompeData).subscribe({
        next: () => {
          this.toast.success('Pompe mise à jour');
          this.closeModal();
          this.loadPompes();
        },
        error: () => this.toast.error('Échec de la mise à jour')
      });
    }
  }

  toggleStatus(id: number | undefined, currentStatus: boolean | undefined): void {
    if (!id) return;
    this.pompeService.deletePompe(id, !(currentStatus ?? false)).subscribe({
      next: () => {
        this.toast.success('Statut de la pompe mis à jour');
        this.loadPompes();
      },
      error: () => this.toast.error('Échec de la modification du statut')
    });
  }

  getStationName(stationId: number): string {
    const st = this.stations.find(s => s.id === stationId);
    return st ? st.nom : `Station #${stationId}`;
  }
}
