import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StationService } from '../../../core/services/station';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGasPump, faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [AsyncPipe, FontAwesomeModule],
  templateUrl: './stations.html',
  styleUrl: './stations.css',
})
export class Stations {
  private readonly stations = inject(StationService);

  stations$ = this.stations.getPublicStations();

  protected readonly faGasPump = faGasPump;
  protected readonly faLocationDot = faLocationDot;
}
