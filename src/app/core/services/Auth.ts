import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { RegisterRequest } from '../models/register-request';
import { Api } from '../api/api';
import { ErrorService } from './error-service';
export interface EmployeDto {
  id: number;
  stationId: number | null;
  nom: string;
  prenom: string;
  actif?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly ROLE_KEY = 'role';
  private readonly STATION_ID_KEY = 'station_id';
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
        const rawRole = res.roles;
        const normalizedRole = rawRole?.startsWith('ROLE_')
          ? rawRole
          : `ROLE_${rawRole}`;
        localStorage.setItem(this.ROLE_KEY, normalizedRole);
        this.roleSubject.next(normalizedRole);
        if (res.stationId) {
          localStorage.setItem(this.STATION_ID_KEY, res.stationId.toString());
        }
      }),
      catchError(err => throwError(() => this.errorService.getMessage(err)))
    );
  }
  register(data: RegisterRequest) {
    return this.http.post(Api.REGISTER, data).pipe(
      catchError(err => throwError(() => this.errorService.getMessage(err)))
    );
  }
  registerEmploye(data: any) {
    return this.http.post(Api.REGISTER_EMPLOYE, data).pipe(
      catchError(err => throwError(() => this.errorService.getMessage(err)))
    );
  }

  changePassword(data: any) {
    return this.http.post(Api.CHANGE_PASSWORD, data, { responseType: 'text' }).pipe(
      catchError(err => throwError(() => this.errorService.getMessage(err)))
    );
  }

  resetPassword(userId: number, password: String): Observable<any> {
    return this.http.post(Api.RESET_PASSWORD(userId), { password }).pipe(
      catchError(err => throwError(() => this.errorService.getMessage(err)))
    );
  }
  getAllEmployes(): Observable<EmployeDto[]> {
    return this.http.get<EmployeDto[]>(Api.EMPLOYES);
  }
  deleteEmploye(id: number): Observable<void> {
    const url = `${Api.EMPLOYES}/${id}`;
    return this.http.delete<void>(url);
  }
  restoreEmploye(id: number): Observable<void> {
    const url = `${Api.EMPLOYES}/${id}/restore`;
    return this.http.post<void>(url, {});
  }
  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  logout() {
    this.http.post(Api.LOGOUT, {}).subscribe({
      next: () => console.log('Logout documented on backend'),
      error: (err) => console.error('Backend logout notification failed', err)
    });
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.STATION_ID_KEY);
    this.roleSubject.next(null);
  }
  getRole(): string | null {
    const rawRole = localStorage.getItem(this.ROLE_KEY);
    if (!rawRole) {
      return null;
    }
    if (rawRole.startsWith('ROLE_')) {
      return rawRole;
    }
    const normalizedRole = `ROLE_${rawRole}`;
    localStorage.setItem(this.ROLE_KEY, normalizedRole);
    return normalizedRole;
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
getStationId(): number | null {
  const stationId = localStorage.getItem(this.STATION_ID_KEY);
  return stationId ? parseInt(stationId, 10) : null;
}
getUser(): any | null {
  const token = localStorage.getItem(this.TOKEN_KEY);
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    return null;
  }
}
  getUsername(): string | null {
    const user = this.getUser();
    console.log('AuthService: Current User from Token:', user);
    if (!user) return null;
    const name = user.username || user.sub || user.name;
    if (typeof name === 'object') {
      console.warn('AuthService: Username is an object!', name);
      return JSON.stringify(name);
    }
    return name || null;
  }
}