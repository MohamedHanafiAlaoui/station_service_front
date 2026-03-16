import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../api/api';
import { BadgeSellRequest } from '../models/badge';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  constructor(private readonly http: HttpClient) {}

  sellFuel(request: BadgeSellRequest): Observable<any> {
    return this.http.post<any>(`${Api.BADGE}/sell`, request);
  }
}
