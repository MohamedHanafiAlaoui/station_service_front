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

  // Reconciliation methods
  getBookStock(stationId: number, type: string): Observable<number> {
    return this.http.get<number>(`${Api.RECONCILIATION}/book-stock`, {
      params: { stationId, type }
    });
  }

  performReconciliation(dto: any): Observable<any> {
    return this.http.post<any>(Api.RECONCILIATION, dto);
  }

  getReconciliationHistory(stationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${Api.RECONCILIATION}/station/${stationId}/history`);
  }
}