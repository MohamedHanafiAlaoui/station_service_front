import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, EmployeDto } from '../../../core/services/Auth';
import { StationService } from '../../../core/services/station';
import { ToastService } from '../../../core/services/toast.service';
import { Station } from '../../../core/models/station';
import Swal from 'sweetalert2';
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
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  isDrawerOpen = false;
  selectedEmploye: EmployeDto | null = null;
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
        this.applyFilters();
        this.isLoading = false;
        this.cdr.markForCheck();
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
    this.applyFilters();
  }
  setFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  applyFilters(): void {
    let filtered = [...this.employes];
    if (this.statusFilter === 'ACTIVE') {
      filtered = filtered.filter(e => e.actif !== false);
    } else if (this.statusFilter === 'INACTIVE') {
      filtered = filtered.filter(e => e.actif === false);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.nom.toLowerCase().includes(q) || 
        e.prenom.toLowerCase().includes(q)
      );
    }
    this.filteredEmployes = filtered;
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
  async deleteEmploye(id: number | undefined): Promise<void> {
    if (!id) return;
    const result = await Swal.fire({
      title: 'Désactiver l\'employé ?',
      text: "L'employé ne pourra plus se connecter, mais ses actions passées seront conservées.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Oui, désactiver',
      cancelButtonText: 'Annuler',
      background: '#ffffff',
      color: '#1e293b'
    });
    if (result.isConfirmed) {
      this.authService.deleteEmploye(id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Désactivé !',
            text: 'L\'employé a été mis en sommeil.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadEmployes();
        },
        error: () => this.toast.error('Erreur lors de la désactivation')
      });
    }
  }
  async restoreEmploye(id: number | undefined): Promise<void> {
    if (!id) return;
    const result = await Swal.fire({
      title: 'Réactiver l\'employé ?',
      text: "L'employé retrouvera ses accès immédiatement.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Oui, réactiver',
      cancelButtonText: 'Annuler'
    });
    if (result.isConfirmed) {
      this.authService.restoreEmploye(id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Rétabli !',
            text: 'L\'employé est de nouveau actif.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadEmployes();
        },
        error: () => this.toast.error('Erreur lors de la réactivation')
      });
    }
  }
}