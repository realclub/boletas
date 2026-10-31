import { ApiResponse } from './api-response.model';

export type TipoBoleta = 'N' | 'G' | 'V';

export interface BoletaItem {
  anio: number;
  mes: number;
  tipo: TipoBoleta;
  tipoNombre: string;
  recibida: boolean;
  fechaRecepcion: string | null;
  disponible: boolean;
  pdf: string; // ruta relativa ej: "boletas/2026/4/N/pdf"
}

export type BoletasResponse = ApiResponse<BoletaItem[]>;

export interface MesOption {
  value: number;
  label: string;
}

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

export const TIPOS_BOLETA_INFO: Record<TipoBoleta, { label: string; color: string }> = {
  N: { label: 'Normal / Mensual', color: 'blue' },
  G: { label: 'Gratificación', color: 'amber' },
  V: { label: 'Vacaciones', color: 'emerald' }
};
