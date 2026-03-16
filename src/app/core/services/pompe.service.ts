import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../api/api';
import { Pompe } from '../models/pompe';

@Injectable({
  providedIn: 'root'
})
export class PompeService {
  constructor(private readonly http: HttpClient) {}

  getPompeById(id: number): Observable<Pompe> {
    return this.http.get<Pompe>(`${Api.POMPES}/${id}`);
  }

  getActivePompes(): Observable<Pompe[]> {
    return this.http.get<Pompe[]>(`${Api.POMPES}/active`);
  }

  getPompesByStation(stationId: number): Observable<Pompe[]> {
    return this.http.get<Pompe[]>(`${Api.POMPES}/station/${stationId}`);
  }

  addFuel(id: number, quantity: number): Observable<Pompe> {
    return this.http.patch<Pompe>(`${Api.POMPES}/${id}/add?quantity=${quantity}`, {});
  }

  getAllPompes(): Observable<Pompe[]> {
    return this.http.get<Pompe[]>(Api.POMPES);
  }

  createPompe(pompe: Pompe): Observable<Pompe> {
    return this.http.post<Pompe>(Api.POMPES, pompe);
  }

  updatePompe(id: number, pompe: Pompe): Observable<Pompe> {
    return this.http.put<Pompe>(`${Api.POMPES}/${id}`, pompe);
  }

  deletePompe(id: number, enService: boolean = false): Observable<void> {
    let params = new HttpParams().set('enService', enService.toString());
    return this.http.patch<void>(`${Api.POMPES}/${id}`, {}, { params });
  }

  searchPompes(keyword: string): Observable<Pompe[]> {
    let params = new HttpParams().set('keyword', keyword);
    return this.http.get<Pompe[]>(`${Api.POMPES}/search`, { params });
  }
}
