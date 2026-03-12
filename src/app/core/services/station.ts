import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../api/api';
import { Station } from '../models/station';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  constructor(private readonly http: HttpClient) {}

  getPublicStations(): Observable<Station[]> {
    return this.http.get<Station[]>(Api.PUBLIC_STATIONS);
  }
}

