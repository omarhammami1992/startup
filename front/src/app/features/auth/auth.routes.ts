import { Routes } from '@angular/router';

import { guestGuard } from '@core/auth/guards/guest.guard';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/reset-password-request/reset-password-request.component').then(
            (m) => m.ResetPasswordRequestComponent,
          ),
      },
      {
        path: 'reset-password/confirm',
        loadComponent: () =>
          import('./pages/reset-password-confirm/reset-password-confirm.component').then(
            (m) => m.ResetPasswordConfirmComponent,
          ),
      },
    ],
  },
];
