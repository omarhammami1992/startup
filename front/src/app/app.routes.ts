import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'profile' },
  {
    path: 'auth',
    loadChildren: () =>
      import('@features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('@features/profile/profile.routes').then((m) => m.profileRoutes),
  },
  { path: '**', redirectTo: 'profile' },
];
