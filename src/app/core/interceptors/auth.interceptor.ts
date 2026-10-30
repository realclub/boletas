import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  let modifiedReq = req;

  // Si tenemos token y la petición va dirigida al API sin cabecera Authorization previa
  if (token && req.url.startsWith(environment.apiBaseUrl) && !req.headers.has('Authorization')) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized: token expirado o inválido
      if (error.status === 401 && !req.url.includes(environment.endpoints.login)) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
