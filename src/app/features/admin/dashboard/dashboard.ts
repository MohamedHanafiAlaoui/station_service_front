import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationService } from '../../../core/services/station';
import { PompeService } from '../../../core/services/pompe.service';
import { AuthService } from '../../../core/services/Auth';
import { ClientService } from '../../../core/services/client';
import { forkJoin } from 'rxjs';
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

  stats = {
    stations: 0,
    activePompes: 0,
    totalClients: 0,
    totalEmployes: 0
  };

  isLoading = true;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    forkJoin({
      stations: this.stationService.getAllStations(),
      pompes: this.pompeService.getAllPompes(),
      clients: this.clientService.getAllClients(),
      employes: this.authService.getAllEmployes()
    }).subscribe({
      next: (results) => {
        this.stats.stations = results.stations.length;
        this.stats.activePompes = results.pompes.filter(p => p.enService).length;
        this.stats.totalClients = results.clients.length;
        this.stats.totalEmployes = results.employes.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
