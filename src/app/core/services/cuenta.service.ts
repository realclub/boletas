import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CambiarClaveRequest, CambiarClaveResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private readonly http = inject(HttpClient);

  /**
   * Cambiar contraseña: PUT /clave
   * { "claveActual": "...", "claveNueva": "..." }
   */
  cambiarClave(request: CambiarClaveRequest): Observable<CambiarClaveResponse> {
    const url = `${environment.apiBaseUrl}${environment.endpoints.clave}`;
    return this.http.put<CambiarClaveResponse>(url, request);
  }
}
