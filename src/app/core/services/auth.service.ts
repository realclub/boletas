import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  Trabajador,
  UserSession
} from '../models';

const SESSION_TOKEN_KEY = 'rrhh-token';
const SESSION_DATA_KEY = 'rrhh-trabajador';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Signals para estado reactivo
  readonly userSession = signal<UserSession | null>(this.recuperarSesionStorage());
  readonly currentUser = computed(() => this.userSession()?.trabajador ?? null);
  readonly token = computed(() => this.userSession()?.token ?? null);
  readonly isAuthenticated = computed(() => !!this.userSession()?.token);

  /**
   * Ingreso al portal: POST /sesion
   * { "documento": "12345678", "clave": "MiClave1" }
   */
  login(credentials: LoginRequest): Observable<UserSession> {
    const url = `${environment.apiBaseUrl}${environment.endpoints.sesion}`;

    const payload = {
      documento: credentials.documento.trim(),
      clave: credentials.clave
    };

    return this.http.post<LoginResponse>(url, payload).pipe(
      map((res) => {
        if (!res.success || !res.data?.token) {
          throw new Error(res.message || 'Documento o contraseña incorrectos.');
        }

        const session: UserSession = {
          token: res.data.token,
          trabajador: res.data.trabajador
        };

        this.guardarSesion(session);
        return session;
      }),
      catchError((err) => {
        const errorMsg = err?.error?.message || err?.message || 'Error al iniciar sesión.';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Verificar validez de la sesión: GET /sesion
   * Sirve para confirmar si el token sigue vigente al recargar la página
   */
  verificarSesion(): Observable<Trabajador | null> {
    const currentToken = this.token();
    if (!currentToken) return of(null);

    const url = `${environment.apiBaseUrl}${environment.endpoints.sesion}`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        if (res.success && res.data) {
          const trabajador: Trabajador = res.data;
          const session: UserSession = { token: currentToken, trabajador };
          this.guardarSesion(session);
          return trabajador;
        }
        this.logout();
        return null;
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  /**
   * Cerrar sesión: DELETE /sesion
   */
  logout(): void {
    const currentToken = this.token();
    if (currentToken) {
      const url = `${environment.apiBaseUrl}${environment.endpoints.sesion}`;
      // Intentar avisar al backend de la salida
      this.http.delete(url).pipe(catchError(() => of(null))).subscribe();
    }

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      sessionStorage.removeItem(SESSION_DATA_KEY);
      localStorage.removeItem(SESSION_TOKEN_KEY);
      localStorage.removeItem(SESSION_DATA_KEY);
    }

    this.userSession.set(null);
    this.router.navigate(['/login']);
  }

  private guardarSesion(session: UserSession): void {
    if (typeof window !== 'undefined') {
      // Regla de API: guardar token en memoria o sessionStorage, NUNCA en localStorage
      sessionStorage.setItem(SESSION_TOKEN_KEY, session.token);
      sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(session.trabajador));
    }
    this.userSession.set(session);
  }

  private recuperarSesionStorage(): UserSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
      const dataStr = sessionStorage.getItem(SESSION_DATA_KEY);
      if (token && dataStr) {
        return {
          token,
          trabajador: JSON.parse(dataStr)
        };
      }
      return null;
    } catch {
      return null;
    }
  }
}
