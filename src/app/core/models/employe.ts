import { User } from './user';
import { Station } from './station';
export interface Employe {
  id?: number;
  user: User;
  station: Station;
}