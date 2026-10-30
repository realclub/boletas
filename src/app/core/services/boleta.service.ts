import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BoletaRequest, BoletaResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BoletaService {
  private readonly http = inject(HttpClient);

  /**
   * Consulta o genera la boleta de pago en el Web API NavaSoft
   * Retorna una respuesta con `data` conteniendo el archivo en formato base64
   */
  consultarBoleta(request: BoletaRequest): Observable<BoletaResponse> {
    const url = `${environment.apiBaseUrl}${environment.endpoints.boleta}`;
    return this.http.post<BoletaResponse>(url, request);
  }
}
