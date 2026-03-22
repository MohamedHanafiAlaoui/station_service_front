export interface ClientState {
  client: any | null;          
  historique: any[] | null;    
  loading: boolean;
  error: string | null;
}
export const initialClientState: ClientState = {
  client: null,
  historique: null,
  loading: false,
  error: null,
};