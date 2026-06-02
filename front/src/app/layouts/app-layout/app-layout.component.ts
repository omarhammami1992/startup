import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-app-layout',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
  ],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/profile" class="app-layout__brand">My App</a>
      <span class="app-layout__spacer"></span>
      @if (auth.currentUser(); as user) {
        <span class="app-layout__user">{{ user.email }}</span>
        <button mat-icon-button (click)="logout()" aria-label="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      }
    </mat-toolbar>
    <main class="app-layout__main">
      <router-outlet />
    </main>
  `,
  styles: `
    .app-layout__brand {
      color: inherit;
      text-decoration: none;
      font-weight: 500;
    }
    .app-layout__spacer { flex: 1 1 auto; }
    .app-layout__user { margin-right: 0.5rem; font-size: 0.9rem; }
    .app-layout__main { padding: 1.5rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => this.router.navigate(['/auth/login']),
    });
  }
}
