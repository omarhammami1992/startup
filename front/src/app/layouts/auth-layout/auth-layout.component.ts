import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <main class="auth-layout">
      <div class="auth-layout__bg" aria-hidden="true"></div>
      <div class="auth-layout__content">
        <router-outlet />
      </div>
    </main>
  `,
  styles: `
    :host { display: block; }

    .auth-layout {
      position: relative;
      min-height: 100dvh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      overflow: hidden;
      background: var(--mat-sys-surface);
    }

    .auth-layout__bg {
      position: absolute;
      inset: -20%;
      background:
        radial-gradient(40rem 30rem at 15% 10%, color-mix(in oklab, var(--mat-sys-primary) 18%, transparent), transparent 70%),
        radial-gradient(35rem 25rem at 85% 90%, color-mix(in oklab, var(--mat-sys-tertiary) 18%, transparent), transparent 70%),
        radial-gradient(30rem 20rem at 50% 60%, color-mix(in oklab, var(--mat-sys-secondary) 12%, transparent), transparent 70%);
      filter: blur(20px);
      z-index: 0;
    }

    .auth-layout__content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
