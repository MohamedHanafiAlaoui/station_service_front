import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JournalAuditService, JournalAuditDto } from '../../../core/services/journal-audit.service';
import { StationService } from '../../../core/services/station';
import { ToastService } from '../../../core/services/toast.service';
import { Station } from '../../../core/models/station';
@Component({
  selector: 'app-journal-audit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './journal-audit.html',
  styleUrl: './journal-audit.css',
})
export class JournalAudit implements OnInit {
  private readonly journalService = inject(JournalAuditService);
  private readonly stationService = inject(StationService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  stations: Station[] = [];
  logs: JournalAuditDto[] = [];
  isLoading = false;
  filterForm: FormGroup;
  currentPage = 0; 
  pageSize = 10;
  totalPages = 1;
  totalElements = 0;
  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage + 1;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  isDrawerOpen = false;
  selectedLog: JournalAuditDto | null = null;
  constructor() {
    this.filterForm = this.fb.group({
      stationId: [''],
      startDate: [new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]],
      endDate: [new Date().toISOString().split('T')[0]]
    });
  }
  ngOnInit(): void {
    this.loadStations();
    this.loadLogs();
  }
  loadStations(): void {
    this.stationService.getAllStations().subscribe({
      next: (data) => this.stations = data,
      error: () => this.toast.error('Erreur stations')
    });
  }
  loadLogs(): void {
    const { stationId, startDate, endDate } = this.filterForm.value;
    this.isLoading = true;
    const obs = stationId 
      ? this.journalService.getJournalsByStation(stationId, startDate, endDate, this.currentPage, this.pageSize)
      : this.journalService.getJournalsByPeriod(startDate, endDate, this.currentPage, this.pageSize);
    obs.subscribe({
      next: (res) => {
        this.logs = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Erreur lors du chargement des journaux');
        this.isLoading = false;
      }
    });
  }
  onFilter(): void {
    this.currentPage = 0;
    this.loadLogs();
  }
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadLogs();
    }
  }
  openDrawer(log: JournalAuditDto): void {
    this.selectedLog = log;
    this.isDrawerOpen = true;
  }
  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedLog = null;
  }
  getStationName(id?: number): string {
    if (!id) return 'System';
    const st = this.stations.find(s => s.id === id);
    return st ? st.nom : `Station #${id}`;
  }
  getActionColor(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('create')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (t.includes('update') || t.includes('edit')) return 'bg-amber-50 text-amber-700 border-amber-100';
    if (t.includes('delete')) return 'bg-rose-50 text-rose-700 border-rose-100';
    if (t.includes('login')) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  }
}