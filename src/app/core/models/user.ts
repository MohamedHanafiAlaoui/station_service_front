export interface User {
  id?: number;
  username: string;
  nom: string;
  prenom: string;
  password?: string; 
  role: 'ADMIN' | 'EMPLOYE' | 'CLIENT';
}

