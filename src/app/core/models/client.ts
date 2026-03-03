import { User } from './user';

export interface Client {
  id?: number;
  user: User;
  solde: number;
  badgeRFID: string;
}
