import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@core/auth/services/auth.service';
import { matchValidator } from '@shared/validators/match.validator';

@Component({
  selector: 'app-reset-password-confirm',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-card>
      <mat-card-header><mat-card-title>Choose a new password</mat-card-title></mat-card-header>
      <mat-card-content>
        @if (!token()) {
          <p class="auth-form__error">Missing or invalid reset token.</p>
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
            <mat-form-field appearance="outline">
              <mat-label>New password</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="new-password" />
              @if (form.controls.password.hasError('required')) {
                <mat-error>Password is required</mat-error>
              }
              @if (form.controls.password.hasError('minlength')) {
                <mat-error>At least 8 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirm password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password" />
              @if (form.controls.confirmPassword.hasError('mismatch')) {
                <mat-error>Passwords do not match</mat-error>
              }
            </mat-form-field>

            @if (errorMessage(); as msg) {
              <p class="auth-form__error">{{ msg }}</p>
            }

            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
              @if (loading()) {
                <mat-spinner diameter="20" />
              } @else {
                Update password
              }
            </button>
          </form>
        }
      </mat-card-content>
      <mat-card-actions class="auth-form__links">
        <a routerLink="/auth/login">Back to sign in</a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .auth-form { display: flex; flex-direction: column; gap: 0.5rem; }
    .auth-form__error { color: var(--mat-sys-error); margin: 0; }
    .auth-form__links { padding: 0 1rem 1rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordConfirmComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly token = input<string | null>(null);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchValidator('password', 'confirmPassword') },
  );

  submit(): void {
    const token = this.token();
    if (!token || this.form.invalid || this.loading()) {
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth
      .confirmPasswordReset({ token, password: this.form.controls.password.value })
      .subscribe({
        next: () => this.router.navigate(['/auth/login'], { queryParams: { reset: 1 } }),
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err?.error?.message ?? 'Could not reset password');
        },
      });
  }
}
