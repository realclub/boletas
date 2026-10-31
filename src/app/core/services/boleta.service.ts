import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BoletaItem, BoletasResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BoletaService {
  private readonly http = inject(HttpClient);

  /**
   * Consulta las boletas de un mes: GET /boletas?anio=2026&mes=4
   * Devuelve las boletas de ese periodo (normal, gratificación, vacaciones)
   */
  obtenerBoletasMes(anio: number, mes: number): Observable<BoletaItem[]> {
    const url = `${environment.apiBaseUrl}${environment.endpoints.boletas}`;
    const params = new HttpParams().set('anio', anio).set('mes', mes);

    return this.http.get<BoletasResponse>(url, { params }).pipe(
      map((res) => {
        if (res.success && Array.isArray(res.data)) {
          return res.data;
        }
        return [];
      })
    );
  }

  /**
   * Consulta el histórico de boletas ya recibidas/abiertas: GET /boletas/historico
   */
  obtenerHistorico(): Observable<BoletaItem[]> {
    const url = `${environment.apiBaseUrl}${environment.endpoints.boletasHistorico}`;
    return this.http.get<BoletasResponse>(url).pipe(
      map((res) => {
        if (res.success && Array.isArray(res.data)) {
          return res.data;
        }
        return [];
      })
    );
  }

  /**
   * Obtiene el archivo binario PDF de la boleta (Blob)
   * Al hacer esta petición, la API registra automáticamente la recepción del documento.
   */
  obtenerPdfBlob(pdfPath: string, descargar = false): Observable<Blob> {
    // Si pdfPath ya incluye la ruta relativa devuelta por la API (ej: "boletas/2026/4/N/pdf")
    const cleanPath = pdfPath.startsWith('/') ? pdfPath.substring(1) : pdfPath;
    const url = `${environment.apiBaseUrl}/${cleanPath}`;
    const params = descargar ? new HttpParams().set('descargar', 'true') : undefined;

    return this.http.get(url, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Descarga directamente el archivo PDF con el nombre oficial
   */
  descargarBoleta(boleta: BoletaItem): void {
    this.obtenerPdfBlob(boleta.pdf, true).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const mesPadded = String(boleta.mes).padStart(2, '0');
        a.download = `Boleta-${boleta.anio}-${mesPadded}-${boleta.tipoNombre}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: (err) => {
        console.error('Error al descargar la boleta:', err);
      }
    });
  }
}
