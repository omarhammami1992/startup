import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return of(true);
  }

  return auth.me().pipe(
    map((user) =>
      user
        ? true
        : router.createUrlTree(['/auth/login'], {
            queryParams: { redirect: state.url },
          }),
    ),
  );
};
