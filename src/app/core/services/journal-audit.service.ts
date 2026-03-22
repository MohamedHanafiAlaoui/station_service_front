import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../api/api';
export interface JournalAuditDto {
  id: number;
  dateAction: string;
  typeAction: string;
  description: string;
  stationId?: number;
}
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
@Injectable({
  providedIn: 'root'
})
export class JournalAuditService {
  private readonly http = inject(HttpClient);
  getAllJournals(page: number = 0, size: number = 10): Observable<PageResponse<JournalAuditDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'dateAction,desc');
    return this.http.get<PageResponse<JournalAuditDto>>(Api.JOURNALS, { params });
  }
  getJournalsByStation(stationId: number, start: string, end: string, page: number = 0, size: number = 10): Observable<PageResponse<JournalAuditDto>> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'dateAction,desc');
    return this.http.get<PageResponse<JournalAuditDto>>(`${Api.JOURNALS}/station/${stationId}`, { params });
  }
  getJournalsByPeriod(start: string, end: string, page: number = 0, size: number = 10): Observable<PageResponse<JournalAuditDto>> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'dateAction,desc');
    return this.http.get<PageResponse<JournalAuditDto>>(`${Api.JOURNALS}/period`, { params });
  }
}