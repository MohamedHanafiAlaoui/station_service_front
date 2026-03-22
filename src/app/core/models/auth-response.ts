export interface AuthResponse {
  token: string;
  type: string;
  roles?: string;
  id: number;
  stationId: number | null;
}