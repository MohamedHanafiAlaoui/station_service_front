export interface Approvisionnement {
  id?: number;
  quantite: number;
  typeCarburant: 'ESSENCE' | 'DIESEL';
  stationId: number;
  dateApprovisionnement?: string;
  dateAppro?: string; // For compatibility with some UI components
  niveauApres?: number;
  quantiteDisponible?: number;
  fournisseur?: string;
}