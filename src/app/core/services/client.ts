import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../api/api';
import { ClientDto } from '../models/client';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) {}
  getAllClients(): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(Api.CLIENTS);
  }
  getClientById(id: number): Observable<ClientDto> {
    return this.http.get<ClientDto>(`${Api.CLIENTS}/${id}`);
  }
  searchClients(keyword: string): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(`${Api.CLIENTS}/search`, {
      params: { keyword }
    });
  }
  createClient(body: ClientDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(Api.CLIENTS, body);
  }
  updateClient(id: number, body: Partial<ClientDto>): Observable<ClientDto> {
    return this.http.put<ClientDto>(`${Api.CLIENTS}/${id}`, body);
  }
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${Api.CLIENTS}/${id}`);
  }
  restoreClient(id: number): Observable<void> {
    return this.http.post<void>(`${Api.CLIENTS}/${id}/restore`, {});
  }
  recharge(id: number, montant: number): Observable<void> {
    return this.http.put<void>(`${Api.CLIENTS}/${id}/recharge?montant=${montant}`, {});
  }
  getHistorique(clientId: number, start: string, end: string, pageable: { page: number; size: number }): Observable<{ content: any[] }> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end)
      .set('page', pageable.page)
      .set('size', pageable.size);
    return this.http.get<{ content: any[] }>(`${Api.VENTES}/client/${clientId}`, { params });
  }
}