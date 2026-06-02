import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Profile</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (user(); as u) {
          <dl class="profile__list">
            <dt>Email</dt>
            <dd>{{ u.email }}</dd>
            <dt>Name</dt>
            <dd>{{ fullName() }}</dd>
            <dt>Phone</dt>
            <dd>{{ u.phoneNumber || '—' }}</dd>
            <dt>Roles</dt>
            <dd>{{ u.roles.join(', ') || '—' }}</dd>
          </dl>
        } @else {
          <p>Loading…</p>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .profile__list {
      display: grid;
      grid-template-columns: 120px 1fr;
      row-gap: 0.5rem;
      margin: 0;
    }
    .profile__list dt { font-weight: 500; color: var(--mat-sys-on-surface-variant); }
    .profile__list dd { margin: 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);

  protected readonly user = this.auth.currentUser;
  protected readonly fullName = computed(() => {
    const u = this.user();
    if (!u) return '';
    return [u.firstName, u.lastName].filter(Boolean).join(' ') || '—';
  });
}
