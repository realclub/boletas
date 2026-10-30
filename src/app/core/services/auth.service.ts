import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, switchMap, tap, map, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  UsuarioResponse,
  UsuarioData,
  UserSession
} from '../models';

const SESSION_KEY = 'rcl_boleta_session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Signals para estado reactivo
  readonly userSession = signal<UserSession | null>(this.recuperarSesionStorage());
  readonly currentUser = computed(() => this.userSession()?.usuario ?? null);
  readonly token = computed(() => this.userSession()?.token ?? null);
  readonly isAuthenticated = computed(() => !!this.userSession()?.token);

  /**
   * Autenticación con el Web API NavaSoft:
   * 1. GetLogin -> Obtiene token Bearer
   * 2. GetUsuario -> Obtiene perfil del colaborador
   */
  login(credentials: LoginRequest): Observable<UserSession> {
    const loginUrl = `${environment.apiBaseUrl}${environment.endpoints.login}`;
    const usuarioUrl = `${environment.apiBaseUrl}${environment.endpoints.usuario}`;

    // Payload idéntico a LoginClass de PHP
    const payload = {
      codUsuario: credentials.nomUsuario,
      nomUsuario: credentials.nomUsuario,
      pwdUsuario: credentials.pwdUsuario,
      IPEquipo: typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1',
      Email: ''
    };

    console.log('[AuthService] Enviando GetLogin:', loginUrl, payload.nomUsuario);

    return this.http.post<any>(loginUrl, payload).pipe(
      switchMap((loginRes: any) => {
        console.log('[AuthService] Respuesta GetLogin:', loginRes);

        // Validar éxito de login
        const isSuccess = loginRes?.success === true || String(loginRes?.success).toLowerCase() === 'true';
        const token = loginRes?.data?.token || loginRes?.data?.Token || loginRes?.token;

        if (!isSuccess || !token) {
          const errorMsg = loginRes?.message || 'Usuario o contraseña incorrectos';
          return throwError(() => new Error(errorMsg));
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        console.log('[AuthService] Token obtenido. Solicitando GetUsuario...');

        return this.http.post<any>(usuarioUrl, payload, { headers }).pipe(
          map((userRes: any) => {
            console.log('[AuthService] Respuesta GetUsuario:', userRes);
            const uData = userRes?.data || userRes || {};

            const usuario: UsuarioData = {
              codTra: uData.codTra || uData.CodTra || credentials.nomUsuario,
              nomTra: uData.nomTra || uData.NomTra || credentials.nomUsuario,
              nroDni: uData.nroDni || uData.NroDni || credentials.nomUsuario,
              email: uData.email || uData.Email || '',
              codCia: uData.codCia || uData.CodCia || '',
              nomCia: uData.nomCia || uData.NomCia || 'Real Club de Lima'
            };

            const session: UserSession = { token, usuario };
            this.guardarSesion(session);
            return session;
          }),
          catchError((userErr) => {
            console.warn('[AuthService] No se pudo obtener GetUsuario, usando perfil por defecto:', userErr);
            // Si GetLogin fue exitoso, no bloqueamos al usuario si GetUsuario falla
            const fallbackUser: UsuarioData = {
              codTra: credentials.nomUsuario,
              nomTra: credentials.nomUsuario,
              nroDni: credentials.nomUsuario,
              nomCia: 'Real Club de Lima'
            };
            const session: UserSession = { token, usuario: fallbackUser };
            this.guardarSesion(session);
            return of(session);
          })
        );
      }),
      catchError((err) => {
        console.error('[AuthService] Error en login:', err);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    }
    this.userSession.set(null);
    this.router.navigate(['/login']);
  }

  private guardarSesion(session: UserSession): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    this.userSession.set(session);
  }

  private recuperarSesionStorage(): UserSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const saved = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
}
