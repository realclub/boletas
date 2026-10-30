import { ApiResponse } from './api-response.model';

export interface CambiarClaveRequest {
  CodUsuario: string;
  CodTra: string;
  PwdUsuario: string;
}

export type CambiarClaveResponse = ApiResponse<any>;
