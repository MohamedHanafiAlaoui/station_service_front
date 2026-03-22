import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationService } from '../../../core/services/station';
import { PompeService } from '../../../core/services/pompe.service';
import { AuthService } from '../../../core/services/Auth';
import { ClientService } from '../../../core/services/client';
import { VenteService } from '../../../core/services/vente.service';
import { ApprovisionnementService } from '../../../core/services/approvisionnement.service';
import { forkJoin, map, of, catchError } from 'rxjs';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly stationService = inject(StationService);
  private readonly pompeService = inject(PompeService);
  private readonly clientService = inject(ClientService);
  private readonly authService = inject(AuthService);
  private readonly venteService = inject(VenteService);
  private readonly approService = inject(ApprovisionnementService);
  private readonly cdr = inject(ChangeDetectorRef);
  stats = {
    totalStations: 0,
    activeStations: 0,
    inactiveStations: 0,
    totalPompes: 0,
    activePompes: 0,
    inactivePompes: 0,
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    totalEmployes: 0,
    activeEmployes: 0,
    inactiveEmployes: 0
  };
  isLoading = true;
  recentActivity: any[] = [];
  ngOnInit(): void {
    this.loadStats();
  }
  loadStats(): void {
    this.isLoading = true;
    let completedCount = 0;
    const totalCalls = 6;
    const checkDone = () => {
      completedCount++;
      if (completedCount >= totalCalls) {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    };
    this.stationService.getAllStations().subscribe({
      next: (data) => {
        const items = Array.isArray(data) ? data : [];
        this.stats.totalStations = items.length;
        this.stats.activeStations = items.filter((s:any) => s.active).length;
        this.stats.inactiveStations = items.filter((s:any) => !s.active).length;
        checkDone();
      },
      error: () => checkDone()
    });
    this.pompeService.getAllPompes().subscribe({
      next: (data) => {
        const items = Array.isArray(data) ? data : [];
        this.stats.totalPompes = items.length;
        this.stats.activePompes = items.filter((p:any) => p.enService).length;
        this.stats.inactivePompes = items.filter((p:any) => !p.enService).length;
        checkDone();
      },
      error: () => checkDone()
    });
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        const items = Array.isArray(data) ? data : [];
        this.stats.totalClients = items.length;
        this.stats.activeClients = items.filter((c:any) => c.actif !== false).length;
        this.stats.inactiveClients = items.filter((c:any) => c.actif === false).length;
        checkDone();
      },
      error: () => checkDone()
    });
    this.authService.getAllEmployes().subscribe({
      next: (data) => {
        const items = Array.isArray(data) ? data : [];
        this.stats.totalEmployes = items.length;
        this.stats.activeEmployes = items.filter((e:any) => e.actif !== false).length;
        this.stats.inactiveEmployes = items.filter((e:any) => e.actif === false).length;
        checkDone();
      },
      error: () => checkDone()
    });
    this.venteService.getAllVentes({ page: 0, size: 5 }).subscribe({
      next: (results) => {
        const raw = (results as any)?.content || results || [];
        const ventes = (Array.isArray(raw) ? raw : []).map((v: any) => ({
          ...v,
          type: 'SALE',
          displayDate: v.dateVente,
          description: `Vente de ${v.quantite}L (#${v.id})`
        }));
        this.recentActivity = [...this.recentActivity, ...ventes]
          .sort((a,b) => new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime())
          .slice(0, 6);
        checkDone();
      },
      error: () => checkDone()
    });
    this.approService.getAllApprovisionnements().subscribe({
      next: (data) => {
        const raw = (data as any)?.content || data || [];
        const appros = (Array.isArray(raw) ? raw : []).map((a: any) => ({
          ...a,
          type: 'SUPPLY',
          displayDate: a.dateApprovisionnement || a.dateAppro,
          description: `Approvisionnement: ${a.quantite}L (#${a.id})`
        }));
        this.recentActivity = [...this.recentActivity, ...appros]
          .filter(x => x.displayDate)
          .sort((a,b) => new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime())
          .slice(0, 6);
        checkDone();
      },
      error: () => checkDone()
    });
    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 5000);
  }
}