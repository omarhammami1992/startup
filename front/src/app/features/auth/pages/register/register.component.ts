import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@core/auth/services/auth.service';
import { matchValidator } from '@shared/validators/match.validator';

@Component({
  selector: 'app-register',
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
          <mat-icon>person_add</mat-icon>
        </div>
        <h1 class="auth-card__title">Create your account</h1>
        <p class="auth-card__subtitle">It only takes a minute to get started</p>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
        <div class="auth-form__row">
          <mat-form-field appearance="outline" class="auth-form__field">
            <mat-label>First name</mat-label>
            <input matInput formControlName="firstName" autocomplete="given-name" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="auth-form__field">
            <mat-label>Last name</mat-label>
            <input matInput formControlName="lastName" autocomplete="family-name" />
          </mat-form-field>
        </div>

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
          <mat-label>Phone number</mat-label>
          <mat-icon matIconPrefix>phone</mat-icon>
          <input
            matInput
            type="tel"
            formControlName="phoneNumber"
            autocomplete="tel"
            placeholder="+33 6 12 34 56 78"
          />
          @if (form.controls.phoneNumber.hasError('required')) {
            <mat-error>Phone number is required</mat-error>
          }
          @if (form.controls.phoneNumber.hasError('pattern')) {
            <mat-error>Invalid phone number</mat-error>
          }
          @if (form.controls.phoneNumber.hasError('minlength')) {
            <mat-error>At least 6 digits</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="auth-form__field">
          <mat-label>Password</mat-label>
          <mat-icon matIconPrefix>lock</mat-icon>
          <input
            matInput
            [type]="hidePassword() ? 'password' : 'text'"
            formControlName="password"
            autocomplete="new-password"
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
          <mat-hint align="end">At least 8 characters</mat-hint>
          @if (form.controls.password.hasError('required')) {
            <mat-error>Password is required</mat-error>
          }
          @if (form.controls.password.hasError('minlength')) {
            <mat-error>At least 8 characters</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="auth-form__field">
          <mat-label>Confirm password</mat-label>
          <mat-icon matIconPrefix>lock</mat-icon>
          <input
            matInput
            [type]="hidePassword() ? 'password' : 'text'"
            formControlName="confirmPassword"
            autocomplete="new-password"
          />
          @if (form.controls.confirmPassword.hasError('mismatch')) {
            <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>

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
            <span>Create account</span>
          }
        </button>
      </form>

      <div class="auth-card__divider">
        <mat-divider />
        <span>or</span>
        <mat-divider />
      </div>

      <p class="auth-card__footer">
        Already have an account?
        <a routerLink="/auth/login">Sign in</a>
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

    .auth-form__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    @media (max-width: 480px) {
      .auth-form__row { grid-template-columns: 1fr; gap: 0; }
    }

    .auth-form__field { width: 100%; }

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
      margin-top: 0.5rem;
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
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly hidePassword = signal(true);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group(
    {
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern(/^\+?[0-9 ()-]+$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchValidator('password', 'confirmPassword') },
  );

  submit(): void {
    if (this.form.invalid || this.loading()) {
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    const { confirmPassword: _confirm, ...payload } = this.form.getRawValue();
    this.auth.register(payload).subscribe({
      next: () => this.router.navigate(['/auth/login'], { queryParams: { registered: 1 } }),
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Registration failed');
      },
    });
  }
}
