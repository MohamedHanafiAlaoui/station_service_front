import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { RegisterRequest } from '../models/register-request';
import { Api } from '../api/api';
import { ErrorService } from './error-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  login(username: string, password: string) {
    return this.http.post<AuthResponse>(
      Api.LOGIN,
      { username, password }
    ).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem('role', res.role);
      }),
      catchError(err => throwError(() => this.errorService.getMessage(err)))
    );
  }

  register(data: RegisterRequest) {
    return this.http.post(Api.REGISTER, data).pipe(
      catchError(err => throwError(() => this.errorService.getMessage(err)))
    );
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('role');
  }

  isLoggedIn() {
    return !!this.token;
  }

  getRole() {
    return localStorage.getItem('role');
  }
}
