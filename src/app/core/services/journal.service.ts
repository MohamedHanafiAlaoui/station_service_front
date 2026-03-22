import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../api/api';
@Injectable({
  providedIn: 'root'
})
export class JournalService {
  constructor(private readonly http: HttpClient) {}
  getJournalsByStation(stationId: number, start: string, end: string, pageable: any): Observable<any> {
    let params = new HttpParams();
    if (start) params = params.set('start', start);
    if (end) params = params.set('end', end);
    if (pageable) {
      params = params.set('page', pageable.page).set('size', pageable.size);
    }
    return this.http.get<any>(`${Api.JOURNALS}/station/${stationId}`, { params });
  }
}