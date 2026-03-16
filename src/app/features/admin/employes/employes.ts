import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, EmployeDto } from '../../../core/services/Auth';
import { StationService } from '../../../core/services/station';
import { ToastService } from '../../../core/services/toast.service';
import { Station } from '../../../core/models/station';

@Component({
  selector: 'app-employes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employes.html',
  styleUrl: './employes.css',
})
export class Employes implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly stationService = inject(StationService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  employes: EmployeDto[] = [];
  filteredEmployes: EmployeDto[] = [];
  pagedEmployes: EmployeDto[] = [];
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
  selectedEmploye: EmployeDto | null = null;

  // Modal State
  isModalOpen = false;
  employeForm: FormGroup;

  constructor() {
    this.employeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      stationId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadStationsForSelect();
    this.loadEmployes();
  }

  private updatePagedItems(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredEmployes.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedEmployes = this.filteredEmployes.slice(start, start + this.pageSize);
  }

  loadEmployes(): void {
    this.isLoading = true;
    this.authService.getAllEmployes().subscribe({
      next: (data) => {
        this.employes = data;
        this.filteredEmployes = data;
        this.currentPage = 1;
        this.isLoading = false;
        this.updatePagedItems();
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Impossible de charger les employés');
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
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = query;
    if (query) {
      this.filteredEmployes = this.employes.filter(e =>
        e.nom.toLowerCase().includes(query) || e.prenom.toLowerCase().includes(query)
      );
    } else {
      this.filteredEmployes = this.employes;
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

  openDrawer(employe: EmployeDto): void {
    this.selectedEmploye = employe;
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedEmploye = null;
  }

  openModal(): void {
    this.isModalOpen = true;
    this.employeForm.reset();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.employeForm.reset();
  }

  getStationName(stationId: number | null): string {
    if (!stationId) return 'Non assigné';
    const st = this.stations.find(s => s.id === stationId);
    return st ? st.nom : `Station #${stationId}`;
  }

  onSubmit(): void {
    if (this.employeForm.invalid) return;

    const employeData = {
      ...this.employeForm.value,
      role: 'EMPLOYE',
      actif: true
    };

    this.authService.registerEmploye(employeData).subscribe({
      next: () => {
        this.toast.success('Employé enregistré avec succès');
        this.closeModal();
        this.loadEmployes();
      },
      error: () => this.toast.error('Échec de la création de l\'employé')
    });
  }
}
