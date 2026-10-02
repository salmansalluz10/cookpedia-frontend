import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService),
    router = inject(Router);
  return (
    auth.signedIn ||
    router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })
  );
};
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService),
    router = inject(Router);
  if (!auth.signedIn)
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  return auth.admin || router.createUrlTree(['/']);
};
