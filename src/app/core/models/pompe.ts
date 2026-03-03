import { Station } from './station';

export interface Pompe {
  id?: number;
  numero: string;
  typeCarburant: 'ESSENCE' | 'DIESEL';
  station: Station;
}
