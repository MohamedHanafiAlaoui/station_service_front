import { createAction, props } from '@ngrx/store';
import { ClientDto } from '../../../../core/models/client';

export const loadClients = createAction('[Clients] Load Clients');
export const loadClientsSuccess = createAction('[Clients] Load Clients Success', props<{ clients: ClientDto[] }>());
export const loadClientsFailure = createAction('[Clients] Load Clients Failure', props<{ error: string }>());

export const searchClients = createAction('[Clients] Search Clients', props<{ keyword: string }>());
export const searchClientsSuccess = createAction('[Clients] Search Clients Success', props<{ clients: ClientDto[] }>());
export const searchClientsFailure = createAction('[Clients] Search Clients Failure', props<{ error: string }>());

export const createClient = createAction('[Clients] Create Client', props<{ client: ClientDto }>());
export const createClientSuccess = createAction('[Clients] Create Client Success', props<{ client: ClientDto }>());
export const createClientFailure = createAction('[Clients] Create Client Failure', props<{ error: string }>());

export const updateClient = createAction('[Clients] Update Client', props<{ id: number; client: Partial<ClientDto> }>());
export const updateClientSuccess = createAction('[Clients] Update Client Success', props<{ client: ClientDto }>());
export const updateClientFailure = createAction('[Clients] Update Client Failure', props<{ error: string }>());

export const deleteClient = createAction('[Clients] Delete Client', props<{ id: number }>());
export const deleteClientSuccess = createAction('[Clients] Delete Client Success', props<{ id: number }>());
export const deleteClientFailure = createAction('[Clients] Delete Client Failure', props<{ error: string }>());

export const rechargeClient = createAction('[Clients] Recharge Client', props<{ id: number; montant: number }>());
export const rechargeClientSuccess = createAction('[Clients] Recharge Client Success', props<{ id: number; montant: number }>());
export const rechargeClientFailure = createAction('[Clients] Recharge Client Failure', props<{ error: string }>());
