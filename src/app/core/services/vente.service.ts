import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../api/api';
import { Vente } from '../models/vente';
@Injectable({
  providedIn: 'root'
})
export class VenteService {
  constructor(private readonly http: HttpClient) {}
  getVentesByStation(stationId: number, start: string, end: string, pageable: any): Observable<any> {
    let params = new HttpParams();
    const startDate = start?.includes('T') ? start.split('T')[0] : start;
    const endDate = end?.includes('T') ? end.split('T')[0] : end;
    if (startDate) params = params.set('start', startDate);
    if (endDate) params = params.set('end', endDate);
    if (pageable) {
      params = params.set('page', pageable.page)
                     .set('size', pageable.size)
                     .set('sort', pageable.sort || 'dateVente,desc');
    }
    return this.http.get<any>(`${Api.VENTES}/station/${stationId}`, { params });
  }
  getVentesByStationAndPompe(stationId: number, pompeId: number, start: string, end: string, pageable: any): Observable<any> {
    let params = new HttpParams();
    const startDate = start?.includes('T') ? start.split('T')[0] : start;
    const endDate = end?.includes('T') ? end.split('T')[0] : end;
    if (startDate) params = params.set('start', startDate);
    if (endDate) params = params.set('end', endDate);
    if (pageable) {
      params = params.set('page', pageable.page).set('size', pageable.size);
    }
    return this.http.get<any>(`${Api.VENTES}/station/${stationId}/pompe/${pompeId}`, { params });
  }
  getTotalQuantiteByStation(stationId: number, start: string, end: string): Observable<number> {
    let params = new HttpParams();
    const startDate = start?.includes('T') ? start.split('T')[0] : start;
    const endDate = end?.includes('T') ? end.split('T')[0] : end;
    if (startDate) params = params.set('start', startDate);
    if (endDate) params = params.set('end', endDate);
    return this.http.get<number>(`${Api.VENTES}/station/${stationId}/total-quantite`, { params });
  }
  getTotalMontantByStation(stationId: number, start: string, end: string): Observable<number> {
    let params = new HttpParams();
    const startDate = start?.includes('T') ? start.split('T')[0] : start;
    const endDate = end?.includes('T') ? end.split('T')[0] : end;
    if (startDate) params = params.set('start', startDate);
    if (endDate) params = params.set('end', endDate);
    return this.http.get<number>(`${Api.VENTES}/station/${stationId}/total-montant`, { params });
  }
  getAllVentes(pageable: any): Observable<any> {
    let params = new HttpParams();
    if (pageable) {
      params = params.set('page', pageable.page)
                     .set('size', pageable.size)
                     .set('sort', pageable.sort || 'dateVente,desc');
    }
    return this.http.get<any>(Api.VENTES, { params });
  }

  getclientvent(id:number)
  {
 return this.http.get<number>(`${Api.VENTES}/clienr/vent/${id}`);
  }
}