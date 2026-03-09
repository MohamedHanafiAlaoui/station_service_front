import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { RegisterRequest } from '../models/register-request';
import { Api } from '../api/api';
import { ErrorService } from './error-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly ROLE_KEY = 'role';

  private roleSubject = new BehaviorSubject<string | null>(this.getRole());
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private errorService: ErrorService) {}


  login(username: string, password: string) {
    return this.http.post<AuthResponse>(
      Api.LOGIN,
      { username, password }
    ).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.ROLE_KEY, res.role);

        
        this.roleSubject.next(res.role);
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
    localStorage.removeItem(this.ROLE_KEY);

    this.roleSubject.next(null);
  }


  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  isLoggedIn() {
    return !!this.token;
  }

  getUserId(): number | null {
  const token = localStorage.getItem(this.TOKEN_KEY);
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id; 
  } catch (e) {
    return null;
  }
}

  

}
