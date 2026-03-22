import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Observable } from 'rxjs';
import { UpdateNameRequest } from '../models/UpdateNameRequest';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  updateNomPrenom(id: number, payload: UpdateNameRequest): Observable<string> {
    return this.http.put(Api.UPDATE_NAME(id), payload, { responseType: 'text' });  }
}