export interface User {
  id?: number;
  username: string;
  nom: string;
  prenom: string;
  actif?: boolean;
  role: 'ADMIN' | 'EMPLOYE' | 'CLIENT';
  stationId?: number;
  password?: string;
}

