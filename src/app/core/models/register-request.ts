export interface RegisterRequest {
  username: string;
  nom: string;
  prenom: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYE' | 'CLIENT';
}