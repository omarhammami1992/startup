import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-card class="auth-card" appearance="outlined">
      <header class="auth-card__head">
        <div class="auth-card__logo">
          <mat-icon>lock_person</mat-icon>
        </div>
        <h1 class="auth-card__title">Welcome back</h1>
        <p class="auth-card__subtitle">Sign in to continue to your account</p>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
        <mat-form-field appearance="outline" class="auth-form__field">
          <mat-label>Email</mat-label>
          <mat-icon matIconPrefix>mail</mat-icon>
          <input matInput type="email" formControlName="email" autocomplete="email" />
          @if (form.controls.email.hasError('required')) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.controls.email.hasError('email')) {
            <mat-error>Invalid email</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="auth-form__field">
          <mat-label>Password</mat-label>
          <mat-icon matIconPrefix>lock</mat-icon>
          <input
            matInput
            [type]="hidePassword() ? 'password' : 'text'"
            formControlName="password"
            autocomplete="current-password"
          />
          <button
            mat-icon-button
            matIconSuffix
            type="button"
            (click)="hidePassword.set(!hidePassword())"
            [attr.aria-label]="hidePassword() ? 'Show password' : 'Hide password'"
            tabindex="-1"
          >
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (form.controls.password.hasError('required')) {
            <mat-error>Password is required</mat-error>
          }
        </mat-form-field>

        <a routerLink="/auth/reset-password" class="auth-form__forgot">
          Forgot password?
        </a>

        @if (errorMessage(); as msg) {
          <div class="auth-form__error" role="alert">
            <mat-icon>error_outline</mat-icon>
            <span>{{ msg }}</span>
          </div>
        }

        <button
          mat-flat-button
          color="primary"
          type="submit"
          class="auth-form__submit"
          [disabled]="form.invalid || loading()"
        >
          @if (loading()) {
            <mat-spinner diameter="20" />
          } @else {
            <span>Sign in</span>
          }
        </button>
      </form>

      <div class="auth-card__divider">
        <mat-divider />
        <span>or</span>
        <mat-divider />
      </div>

      <p class="auth-card__footer">
        Don't have an account?
        <a routerLink="/auth/register">Create one</a>
      </p>
    </mat-card>
  `,
  styles: `
    .auth-card {
      padding: 2rem 1.75rem;
      border-radius: 1.25rem;
      box-shadow: 0 20px 50px -20px rgb(0 0 0 / 0.25);
      background: var(--mat-sys-surface);
    }

    .auth-card__head {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 1.75rem;
    }

    .auth-card__logo {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      background: color-mix(in oklab, var(--mat-sys-primary) 12%, transparent);
      color: var(--mat-sys-primary);
      margin-bottom: 1rem;
    }
    .auth-card__logo mat-icon { font-size: 28px; width: 28px; height: 28px; }

    .auth-card__title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: var(--mat-sys-on-surface);
    }

    .auth-card__subtitle {
      margin: 0.35rem 0 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .auth-form__field { width: 100%; }

    .auth-form__forgot {
      align-self: flex-end;
      font-size: 0.85rem;
      color: var(--mat-sys-primary);
      text-decoration: none;
      margin: -0.25rem 0 0.5rem;
    }
    .auth-form__forgot:hover { text-decoration: underline; }

    .auth-form__error {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 0.75rem;
      margin-bottom: 0.75rem;
      border-radius: 0.5rem;
      background: color-mix(in oklab, var(--mat-sys-error) 10%, transparent);
      color: var(--mat-sys-error);
      font-size: 0.875rem;
    }
    .auth-form__error mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .auth-form__submit {
      width: 100%;
      height: 48px;
      font-weight: 500;
      border-radius: 0.75rem;
    }

    .auth-card__divider {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 0.75rem;
      margin: 1.5rem 0 1rem;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .auth-card__footer {
      text-align: center;
      margin: 0;
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .auth-card__footer a {
      color: var(--mat-sys-primary);
      text-decoration: none;
      font-weight: 500;
      margin-left: 0.25rem;
    }
    .auth-card__footer a:hover { text-decoration: underline; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly hidePassword = signal(true);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid || this.loading()) {
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/profile';
        this.router.navigateByUrl(redirect);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Invalid credentials');
      },
    });
  }
}
