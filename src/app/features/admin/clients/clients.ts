import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../core/services/client';
import { ToastService } from '../../../core/services/toast.service';
import { ClientDto } from '../../../core/models/client';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  clients: ClientDto[] = [];
  filteredClients: ClientDto[] = [];
  pagedClients: ClientDto[] = [];
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
  selectedClient: ClientDto | null = null;

  // Modal State
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  clientForm: FormGroup;
  selectedClientId?: number;

  constructor() {
    this.clientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      badgeRFID: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  private updatePagedItems(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredClients.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedClients = this.filteredClients.slice(start, start + this.pageSize);
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
        this.currentPage = 1;
        this.isLoading = false;
        this.updatePagedItems();
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Impossible de charger les clients');
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = query;
    if (query) {
      this.filteredClients = this.clients.filter(c => 
        c.nom.toLowerCase().includes(query) || 
        c.prenom.toLowerCase().includes(query) || 
        c.badgeRFID.toLowerCase().includes(query) ||
        c.username.toLowerCase().includes(query)
      );
    } else {
      this.filteredClients = this.clients;
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

  openDrawer(client: ClientDto): void {
    this.selectedClient = client;
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedClient = null;
  }

  openModal(mode: 'create' | 'edit', client?: ClientDto): void {
    this.modalMode = mode;
    this.isModalOpen = true;
    
    if (mode === 'edit' && client) {
      this.selectedClientId = client.id;
      this.clientForm.patchValue({
        nom: client.nom,
        prenom: client.prenom,
        username: client.username,
        badgeRFID: client.badgeRFID
      });
    } else {
      this.selectedClientId = undefined;
      this.clientForm.reset();
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.clientForm.reset();
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    const clientData: ClientDto = this.clientForm.value;

    if (this.modalMode === 'create') {
      this.clientService.createClient(clientData).subscribe({
        next: () => {
          this.toast.success('Client créé avec succès');
          this.closeModal();
          this.loadClients();
        },
        error: () => this.toast.error('Échec de la création du client')
      });
    } else if (this.modalMode === 'edit' && this.selectedClientId) {
      this.clientService.updateClient(this.selectedClientId, clientData).subscribe({
        next: () => {
          this.toast.success('Client mis à jour');
          this.closeModal();
          this.loadClients();
        },
        error: () => this.toast.error('Échec de la mise à jour')
      });
    }
  }

  deleteClient(id: number | undefined): void {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.toast.success('Client supprimé avec succès');
          this.loadClients();
        },
        error: () => this.toast.error('Erreur lors de la suppression')
      });
    }
  }

  rechargeClient(id: number | undefined): void {
    if (!id) return;
    const montantStr = prompt('Entrez le montant à recharger (MAD):');
    if (!montantStr) return;
    
    const montant = parseFloat(montantStr);
    if (isNaN(montant) || montant <= 0) {
      this.toast.error('Montant invalide');
      return;
    }

    this.clientService.recharge(id, montant).subscribe({
      next: () => {
        this.toast.success('Compte rechargé avec succès');
        this.loadClients();
      },
      error: () => this.toast.error('Erreur lors de la recharge')
    });
  }
}
