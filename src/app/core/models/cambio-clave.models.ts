import { ApiResponse } from './api-response.model';

export interface CambiarClaveRequest {
  claveActual: string;
  claveNueva: string;
}

export type CambiarClaveResponse = ApiResponse<any>;
