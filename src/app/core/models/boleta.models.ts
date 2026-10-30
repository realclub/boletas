import { ApiResponse } from './api-response.model';

export type TipoPlanilla = 'N' | 'V' | 'G';

export interface TipoPlanillaOption {
  value: TipoPlanilla;
  label: string;
  description: string;
}

export interface MesOption {
  value: number;
  label: string;
}

export interface BoletaRequest {
  CodCia?: string;
  NroDni: string;
  CodTra: string;
  NomTra: string;
  Anno: number;
  Mes: number;
  TipPla: TipoPlanilla;
  NameHost?: string;
}

export type BoletaResponse = ApiResponse<string>;

export const MESES: MesOption[] = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' }
];

export const TIPOS_PLANILLA: TipoPlanillaOption[] = [
  { value: 'N', label: 'Mensual', description: 'Boleta de pago mensual regular' },
  { value: 'V', label: 'Vacaciones', description: 'Boleta correspondiente al periodo vacacional' },
  { value: 'G', label: 'Gratificaciones', description: 'Boleta por gratificación legal (Julio / Diciembre)' }
];
