import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../api/api';
import { Station } from '../models/station';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  constructor(private readonly http: HttpClient) {}

  getAllStations(): Observable<Station[]> {
    return this.http.get<Station[]>(Api.STATIONS);
  }

  getStationById(id: number): Observable<Station> {
    return this.http.get<Station>(`${Api.STATIONS}/${id}`);
  }

  getPublicStations(): Observable<Station[]> {
    return this.http.get<Station[]>(Api.PUBLIC_STATIONS);
  }

  createStation(station: Station): Observable<Station> {
    return this.http.post<Station>(Api.STATIONS, station);
  }

  updateStation(id: number, station: Station): Observable<Station> {
    return this.http.put<Station>(`${Api.STATIONS}/${id}`, station);
  }

  deleteStation(id: number, active: boolean = false): Observable<void> {
    let params = new HttpParams().set('active', active.toString());
    return this.http.patch<void>(`${Api.STATIONS}/${id}`, {}, { params });
  }

  searchStations(keyword: string): Observable<Station[]> {
    let params = new HttpParams().set('keyword', keyword);
    return this.http.get<Station[]>(`${Api.STATIONS}/search`, { params });
  }
}

