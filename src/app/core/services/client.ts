import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../api/api';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {}

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${Api.CLIENTS}/${id}`);
  }

  updateClient(id: number, body: any): Observable<any> {
    return this.http.put<any>(`${Api.CLIENTS}/${id}`, body);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${Api.CLIENTS}/${id}`);
  }

  recharge(id: number, montant: number): Observable<void> {
    return this.http.put<void>(`${Api.CLIENTS}/${id}/recharge?montant=${montant}`, {});
  }

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(Api.CLIENTS);
  }

  createClient(body: any): Observable<any> {
    return this.http.post<any>(Api.CLIENTS, body);
  }

  searchClients(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${Api.CLIENTS}/search`, {
      params: { keyword }
    });
  }

  getHistorique(clientId: number, start: string, end: string, pageable: any): Observable<any> {
    let params = new HttpParams()
      .set('start', start)
      .set('end', end)
      .set('page', pageable.page)
      .set('size', pageable.size);

    return this.http.get<any>(`${Api.VENTES}/client/${clientId}`, { params });
  }
}
