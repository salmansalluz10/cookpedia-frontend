import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, timeout } from 'rxjs';
import { AuthService } from './auth.service';
import { NoticeService, apiError } from './notice.service';
import { API_URL } from './config';
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService),
    notices = inject(NoticeService),
    router = inject(Router);
  if (!(request.url === API_URL || request.url.startsWith(API_URL + '/')))
    return next(request);
  const path = request.url.slice(API_URL.length).split('?')[0];
  const publicRoute = [
    '/register',
    '/login',
    '/all-recipes',
    '/all-testimony',
    '/get-approved-testimony',
    '/health',
  ].includes(path);
  const outgoing =
    !publicRoute && auth.token
      ? request.clone({ setHeaders: { Authorization: 'Bearer ' + auth.token } })
      : request;
  return next(outgoing).pipe(
    timeout(90000),
    catchError((error) => {
      notices.show(apiError(error), 'error');
      if (error.status === 401 && !publicRoute) {
        auth.clear();
        void router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
        });
      }
      return throwError(() => error);
    }),
  );
};
