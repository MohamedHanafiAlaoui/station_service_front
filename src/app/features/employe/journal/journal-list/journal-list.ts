import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as JournalActions from '../../store/journal/journal.actions';
import { selectAllJournals, selectJournalLoading, selectJournalError, selectJournalPagination } from '../../store/journal/journal.selectors';
import { Journal } from '../../../../core/models/journal';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { DateRangePickerComponent } from '../../../../shared/components/date-range-picker/date-range-picker.component';
import { AuthService } from '../../../../core/services/Auth';
@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, TableComponent, DateRangePickerComponent],
  templateUrl: './journal-list.html',
  styleUrl: './journal-list.css',
})
export class JournalList implements OnInit {
  journals$: Observable<Journal[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  pagination$: Observable<{ totalElements: number; totalPages: number }>;
  stationId: number | null = null;
  filterForm: FormGroup;
  tableColumns = [
    { field: 'id', header: 'Audit ID' },
    { field: 'dateAction', header: 'Date & Time' },
    { field: 'typeAction', header: 'Event Type' },
    { field: 'description', header: 'Description' },
    { field: 'utilisateurInfo', header: 'User' }
  ];
  constructor(private store: Store, private fb: FormBuilder, private authService: AuthService) {
    this.journals$ = this.store.select(selectAllJournals);
    this.loading$ = this.store.select(selectJournalLoading);
    this.error$ = this.store.select(selectJournalError);
    this.pagination$ = this.store.select(selectJournalPagination);
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    this.filterForm = this.fb.group({
      startDate: [lastWeek.toISOString().split('T')[0]],
      endDate: [today.toISOString().split('T')[0]]
    });
  }
  ngOnInit(): void {
    this.stationId = this.authService.getStationId();
    this.loadJournals();
  }
  loadJournals(page = 0): void {
    if (!this.stationId) return;
    const { startDate, endDate } = this.filterForm.value;
    const pageable = { page, size: 20, sort: 'dateAction,desc' };
    this.store.dispatch(JournalActions.loadJournals({
      stationId: this.stationId,
      start: startDate,
      end: endDate,
      pageable
    }));
  }
  onFilter(): void {
    this.loadJournals(0);
  }
  getMappedData(data: Journal[]): any[] {
    return data.map(item => ({
      ...item,
      dateAction: new Date(item.dateAction || '').toLocaleString(),
      utilisateurInfo: item.user ? `${item.user.nom} ${item.user.prenom}` : 'System'
    }));
  }
}