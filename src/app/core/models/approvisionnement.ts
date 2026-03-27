export interface Approvisionnement {
  id?: number;
  quantite: number;
  typeCarburant: 'ESSENCE' | 'DIESEL';
  stationId: number;
  dateApprovisionnement?: string;
  dateAppro?: string; 
  niveauApres?: number;
  quantiteDisponible?: number;
  fournisseur?: string;
}