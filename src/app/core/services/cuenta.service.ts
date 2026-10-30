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
   * Actualiza la contraseña del usuario en el Web API NavaSoft
   */
  cambiarClave(request: CambiarClaveRequest): Observable<CambiarClaveResponse> {
    const url = `${environment.apiBaseUrl}${environment.endpoints.cambiarClave}`;
    return this.http.post<CambiarClaveResponse>(url, request);
  }
}
