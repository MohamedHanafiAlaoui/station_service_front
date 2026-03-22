export interface Pompe {
  id?: number;
  codePompe: string;
  typeCarburant: 'ESSENCE' | 'DIESEL';
  capaciteMax: number;
  niveauActuel: number;
  prixParLitre: number;
  enService: boolean;
  stationId: number;
}