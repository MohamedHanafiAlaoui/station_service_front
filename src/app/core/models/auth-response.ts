export interface AuthResponse {
  token: string;
  role: 'ADMIN' | 'EMPLOYE' | 'CLIENT';
}
