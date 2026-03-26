export interface ClientDto {
  id?: number;
  nom: string;
  prenom: string;
  username: string;
  badgeRFID: string;
  solde?: number;
  actif?: boolean;
  password?: string;
}