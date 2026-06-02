import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-reset-password-request',
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
      <mat-card-header><mat-card-title>Reset your password</mat-card-title></mat-card-header>
      <mat-card-content>
        @if (sent()) {
          <p>If an account exists for this email, a reset link has been sent.</p>
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email" />
              @if (form.controls.email.hasError('required')) {
                <mat-error>Email is required</mat-error>
              }
              @if (form.controls.email.hasError('email')) {
                <mat-error>Invalid email</mat-error>
              }
            </mat-form-field>

            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
              @if (loading()) {
                <mat-spinner diameter="20" />
              } @else {
                Send reset link
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
    .auth-form__links { padding: 0 1rem 1rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordRequestComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly loading = signal(false);
  protected readonly sent = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid || this.loading()) {
      return;
    }
    this.loading.set(true);

    this.auth.requestPasswordReset(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.sent.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.sent.set(true);
      },
    });
  }
}
