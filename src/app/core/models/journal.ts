import { Station } from './station';
import { User } from './user';
export interface Journal {
  id?: number;
  dateAction: string;
  typeAction: string;
  description: string;
  stationId?: number;
  user?: User;
  station?: Station;
}