import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../core/services/client';
import { ToastService } from '../../../core/services/toast.service';
import { ClientDto } from '../../../core/models/client';
import { AuthService } from '../../../core/services/Auth';
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
  private readonly authService = inject(AuthService);
  clients: ClientDto[] = [];
  filteredClients: ClientDto[] = [];
  pagedClients: ClientDto[] = [];
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
  selectedClient: ClientDto | null = null;
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  clientForm: FormGroup;
  selectedClientId?: number;
  constructor() {
    this.clientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
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
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Impossible de charger les clients');
        this.isLoading = false;
      }
    });
  }
  private applyFilters(): void {
    let filtered = [...this.clients];
    if (this.statusFilter === 'ACTIVE') {
      filtered = filtered.filter(c => c.actif !== false);
    } else if (this.statusFilter === 'INACTIVE') {
      filtered = filtered.filter(c => c.actif === false);
    }
    const query = this.searchQuery.toLowerCase();
    if (query) {
      filtered = filtered.filter(c => 
        c.nom.toLowerCase().includes(query) || 
        c.prenom.toLowerCase().includes(query) || 
        c.badgeRFID?.toLowerCase().includes(query) ||
        c.username.toLowerCase().includes(query)
      );
    }
    this.filteredClients = filtered;
    this.currentPage = 1;
    this.updatePagedItems();
  }
  setFilter(filter: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.statusFilter = filter;
    this.applyFilters();
  }
  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    this.applyFilters();
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
        username: client.username
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
        next: (createdClient) => {
          Swal.fire({
            icon: 'success',
            title: 'Client Créé!',
            html: `Le client <b>${createdClient.prenom} ${createdClient.nom}</b> a été créé avec succès.<br><br><b>Mot de passe généré :</b> <code style="font-size: 1.2em; padding: 4px; background: #e2e8f0; border-radius: 4px; color: #1e293b;">${createdClient.password || 'Non spécifié'}</code>`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#4f46e5',
            background: '#ffffff',
            color: '#1f2937'
          });
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
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      background: '#1f2937',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteClient(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé !',
              text: 'Le client a été supprimé avec succès.',
              icon: 'success',
              background: '#1f2937',
              color: '#fff'
            });
            this.loadClients();
          },
          error: (err) => {
            console.error('Delete error:', err);
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la suppression. Le client a probablement des enregistrements liés.',
              icon: 'error',
              background: '#1f2937',
              color: '#fff'
            });
          }
        });
      }
    });
  }

  onResetPassword(id: number) {
    Swal.fire({
      title: 'Réinitialiser le mot de passe',
      text: "Saisissez le nouveau mot de passe pour ce client :",
      input: 'password',
      inputPlaceholder: 'Nouveau mot de passe',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Réinitialiser',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#94a3b8',
      inputValidator: (value) => {
        if (!value) {
          return 'Vous devez saisir un mot de passe !'
        }
        if (value.length < 8) {
          return 'Le mot de passe doit contenir au moins 8 caractères.'
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.resetPassword(id, result.value).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Réussite!',
              text: 'Le mot de passe a été réinitialisé avec succès.',
              confirmButtonColor: '#7c3aed'
            });
          },
          error: () => this.toast.error('Échec de la réinitialisation')
        });
      }
    });
  }

  restoreClient(id: number | undefined): void {
    if (!id) return;
    Swal.fire({
      title: 'Restaurer le client ?',
      text: "Le client redeviendra actif.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, restaurer !',
      cancelButtonText: 'Annuler',
      background: '#1f2937',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.restoreClient(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Restauré !',
              text: 'Le client a été restauré avec succès.',
              icon: 'success',
              background: '#1f2937',
              color: '#fff'
            });
            this.loadClients();
          },
          error: (err) => {
            console.error('Restore error:', err);
            this.toast.error('Erreur lors de la restauration');
          }
        });
      }
    });
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