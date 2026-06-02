import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return of(router.createUrlTree(['/profile']));
  }

  return auth.me().pipe(
    map((user) => (user ? router.createUrlTree(['/profile']) : true)),
  );
};
