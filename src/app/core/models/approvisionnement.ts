import { Station } from './station';

export interface Approvisionnement {
  id?: number;
  dateAppro: string;
  quantite: number;
  fournisseur: string;
  station: Station;
}
