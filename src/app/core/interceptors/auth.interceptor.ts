import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  let modifiedReq = req;

  // Si tenemos token y la llamada va dirigida al API de RRHH
  if (token && req.url.startsWith(environment.apiBaseUrl)) {
    modifiedReq = req.clone({
      setHeaders: {
        'X-Rrhh-Sesion': token
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized: sesión vencida o no autorizada
      // Si falla cualquier endpoint con 401 que no sea el login inicial
      const isLoginRequest = req.url.endsWith(environment.endpoints.sesion) && req.method === 'POST';
      if (error.status === 401 && !isLoginRequest) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
