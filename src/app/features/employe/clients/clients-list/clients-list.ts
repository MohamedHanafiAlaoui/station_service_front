import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import * as ClientsActions from '../../store/clients/clients.actions';
import { selectAllClients, selectClientsLoading, selectClientsError } from '../../store/clients/clients.selectors';

import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, TableComponent, RouterModule],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.css',
})
export class ClientsList implements OnInit, OnDestroy {
  clients$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  searchKeyword = '';
  private searchInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  tableColumns = [
    { field: 'nomComplet', header: 'Full Name' },
    { field: 'username', header: 'Username' },
    { field: 'badgeRFID', header: 'RFID Badge' },
    { field: 'solde', header: 'Balance (MAD)' }
  ];

  tableActions = [
    { id: 'edit', label: 'Edit', color: 'blue' },
    { id: 'recharge', label: 'Recharge', color: 'green' }
  ];

  constructor(private store: Store, private router: Router) {
    this.clients$ = this.store.select(selectAllClients);
    this.loading$ = this.store.select(selectClientsLoading);
    this.error$ = this.store.select(selectClientsError);
  }

  ngOnInit(): void {
    this.store.dispatch(ClientsActions.loadClients());

    // Debounce search input: wait 350ms after user stops typing
    this.searchInput$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(keyword => {
      if (keyword.trim().length >= 2) {
        this.store.dispatch(ClientsActions.searchClients({ keyword: keyword.trim() }));
      } else {
        // Reload full list when search is cleared
        this.store.dispatch(ClientsActions.loadClients());
      }
    });
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.searchInput$.next('');
  }

  getMappedClients(clients: any[]): any[] {
    return clients.map(c => ({
      ...c,
      nomComplet: `${c.prenom} ${c.nom}`,
      solde: `${c.solde ?? 0} MAD`
    }));
  }

  handleAction(event: { action: string; row: any }): void {
    if (event.action === 'recharge') {
      this.router.navigate(['/employe/clients', event.row.id, 'recharge']);
    } else if (event.action === 'edit') {
      this.router.navigate(['/employe/clients', event.row.id, 'edit']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
