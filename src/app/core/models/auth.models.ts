import { ApiResponse } from './api-response.model';

export interface LoginRequest {
  nomUsuario: string;
  pwdUsuario: string;
}

export interface LoginData {
  token: string;
}

export type LoginResponse = ApiResponse<LoginData>;

export interface UsuarioData {
  codTra: string;
  nomTra: string;
  nroDni: string;
  email?: string;
  codCia?: string;
  nomCia?: string;
}

export type UsuarioResponse = ApiResponse<UsuarioData>;

export interface UserSession {
  token: string;
  usuario: UsuarioData;
}
