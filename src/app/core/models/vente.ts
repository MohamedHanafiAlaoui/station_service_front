import { Pompe } from './pompe';
import { ClientDto } from './client';

export interface Vente {
  id?: number;
  dateVente: string;
  quantite: number;
  montant: number;
  pompe: Pompe;
  client: ClientDto;
}
