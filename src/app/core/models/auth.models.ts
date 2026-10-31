import { ApiResponse } from './api-response.model';

export interface LoginRequest {
  documento: string;
  clave: string;
}

export interface Trabajador {
  documento: string;
  nombre: string;
  nombreCompleto: string;
}

export interface SesionData {
  token: string;
  expiraEnSegundos?: number;
  trabajador: Trabajador;
}

export type LoginResponse = ApiResponse<SesionData>;
export type SesionResponse = ApiResponse<Trabajador>;

export interface UserSession {
  token: string;
  trabajador: Trabajador;
}
