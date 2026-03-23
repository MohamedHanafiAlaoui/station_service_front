import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { Station } from '../../../core/models/station';
@Component({
  selector: 'app-station-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #map
      class="w-full rounded-lg"
      style="height: 420px; min-height: 320px; width: 100%;"
    ></div>
  `,
})
export class StationMap implements AfterViewInit, OnChanges {
  @ViewChild('map', { static: true }) private mapEl!: ElementRef<HTMLDivElement>;
  @Input() stations: Station[] = [];
  private map?: L.Map;
  private markersLayer?: L.LayerGroup;
  ngAfterViewInit(): void {
    this.initMap();
    this.renderStations();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stations']) {
      this.renderStations();
    }
  }
  private initMap() {
    if (this.map) return;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
    this.map = L.map(this.mapEl.nativeElement, {
      center: [33.57311, -7.589843],
      zoom: 6,
      zoomControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    this.markersLayer = L.layerGroup().addTo(this.map);
    queueMicrotask(() => this.map?.invalidateSize());
  }
  private renderStations() {
    if (!this.map || !this.markersLayer) return;
    this.markersLayer.clearLayers();
    const points: L.LatLngTuple[] = [];
    const icon = L.divIcon({
      className: 'station-marker',
      html: '<i class="fa-solid fa-gas-pump"></i>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
    for (const s of this.stations ?? []) {
      if (typeof s.latitude !== 'number' || typeof s.longitude !== 'number') continue;
      const marker = L.marker([s.latitude, s.longitude], { icon }).bindPopup(
        `<b>${s.nom}</b><br/>${s.adresse}`
      );
      marker.addTo(this.markersLayer);
      points.push([s.latitude, s.longitude]);
    }
    if (points.length > 0) {
      this.map.fitBounds(points, { padding: [20, 20] });
    }
  }
}