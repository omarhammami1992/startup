import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/guards/auth.guard';
import { AppLayoutComponent } from '@layouts/app-layout/app-layout.component';

export const profileRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
];
