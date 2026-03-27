import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../api/api';
import { Approvisionnement } from '../models/approvisionnement';

@Injectable({
  providedIn: 'root'
})
export class ApprovisionnementService {
  constructor(private readonly http: HttpClient) {}

  getApprovisionnementById(id: number): Observable<Approvisionnement> {
    return this.http.get<Approvisionnement>(`${Api.APPROVISIONNEMENTS}/${id}`);
  }

  getApprovisionnementsByStation(stationId: number): Observable<Approvisionnement[]> {
    return this.http.get<Approvisionnement[]>(`${Api.APPROVISIONNEMENTS}/station/${stationId}`);
  }

  getAllApprovisionnements(): Observable<Approvisionnement[]> {
    return this.http.get<Approvisionnement[]>(Api.APPROVISIONNEMENTS);
  }

  createApprovisionnement(app: Approvisionnement): Observable<Approvisionnement> {
    return this.http.post<Approvisionnement>(Api.APPROVISIONNEMENTS, app);
  }
}