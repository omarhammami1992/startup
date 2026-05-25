# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Angular frontend for a Spring Boot backend (developed in parallel by another teammate). Scope is currently an **authentication skeleton** (login, register, reset password, profile).

## Stack

- **Angular 21** — standalone components, signals, **zoneless** change detection (no `zone.js`)
- **Angular Material** (azure-blue theme, async animations)
- **Reactive Forms** typed (`FormBuilder.nonNullable`)
- **TypeScript strict mode**
- Package manager: **npm**
- Node: **≥ 20.19** (use `nvm use 20.19.0` if you hit a version error)

## Commands

```bash
npm start          # ng serve, http://localhost:4200
npm run build      # production build
npm test           # unit tests (Vitest)
```

## Authentication model

**Session / cookie HttpOnly** — NOT JWT. Implications:

- All API requests use `withCredentials: true` (handled by [credentials.interceptor.ts](src/app/core/auth/interceptors/credentials.interceptor.ts))
- **No token stored client-side** — the browser handles the session cookie
- **CSRF** — Spring Security issues an `XSRF-TOKEN` cookie; Angular reads it and replays it as the `X-XSRF-TOKEN` header automatically via `withXsrfConfiguration` in [app.config.ts](src/app/app.config.ts)
- "Logged in?" is resolved via `GET /api/auth/me` (used by `authGuard` and on app bootstrap)
- CORS must be configured on the Spring side with `allowCredentials=true` and an explicit origin (no `*`)

## API contract (aligned with the backend teammate)

```
POST   /api/auth/login                 { email, password }          → User + Set-Cookie
POST   /api/auth/register              { email, password, ... }     → 201
POST   /api/auth/logout                                             → 204
GET    /api/auth/me                                                 → User | 401
POST   /api/auth/password/reset-request  { email }                  → 204
POST   /api/auth/password/reset-confirm  { token, password }        → 204
```

Base URL lives in [src/environments/environment.ts](src/environments/environment.ts) (`apiUrl`).

## Architecture

Feature-based, lazy-loaded, standalone-only.

```
src/app/
├── core/          # singletons (auth service, guards, interceptors, models)
├── shared/        # reusable validators, UI bits, pipes
├── features/      # business features, each with its own routes file
│   ├── auth/
│   └── profile/
├── layouts/       # auth-layout (centered card), app-layout (Material toolbar)
├── app.config.ts  # providers: zoneless, router, HTTP+XSRF+interceptors, animations
└── app.routes.ts  # root routing, lazy-loads features
```

## Path aliases

Use these instead of relative paths (`../../../`):

| Alias        | Maps to              |
|--------------|----------------------|
| `@core/*`    | `src/app/core/*`     |
| `@shared/*`  | `src/app/shared/*`   |
| `@features/*`| `src/app/features/*` |
| `@layouts/*` | `src/app/layouts/*`  |
| `@env/*`     | `src/environments/*` |

Declared in [tsconfig.json](tsconfig.json).

## Conventions

- **Standalone components only** — no `NgModule`
- **Signals for state** — `signal()`, `computed()`, `input()`, `model()`. No `@Input()` decorator unless interop forces it
- **`ChangeDetectionStrategy.OnPush`** on every component
- **Functional guards / interceptors** — `CanActivateFn`, `HttpInterceptorFn`. Never the class-based form
- **New control flow** — `@if`, `@for`, `@switch` in templates. Don't use `*ngIf` / `*ngFor`
- **`inject()` over constructor injection** in components/services
- **Lazy load every feature** via `loadChildren` / `loadComponent`
- **Reactive forms only** — no template-driven forms. Use `fb.nonNullable.group(...)` for typed forms
- **No NgRx** at this scope — signals + services are sufficient. Revisit only if state genuinely needs it
- **One concern per file** — components colocate template/styles inline if short, separate `.html`/`.scss` if non-trivial

## Auth state

`AuthService` ([src/app/core/auth/services/auth.service.ts](src/app/core/auth/services/auth.service.ts)) exposes:

- `currentUser` — readonly signal, `User | null`
- `isAuthenticated` — computed
- `login()`, `register()`, `logout()`, `me()`, `loadSession()`, `requestPasswordReset()`, `confirmPasswordReset()`

Guards: `authGuard` (requires session), `guestGuard` (redirects logged-in users away from /auth).

## Common pitfalls

- **Don't store tokens** in `localStorage` / `sessionStorage` — the auth is cookie-based
- **Don't bypass the credentials interceptor** with manual `fetch()` — go through `HttpClient`
- **Don't add `@angular/animations` to providers manually** — `provideAnimationsAsync()` handles it
- **Don't import Material modules at the root** — import per-component (standalone)
- If `provideAnimationsAsync()` fails with `Could not resolve "@angular/animations/browser"` after a fresh install, run `npm install @angular/animations`

## When extending the app

- **New feature?** Add a folder under `features/`, create a `<name>.routes.ts`, lazy-load it from [app.routes.ts](src/app/app.routes.ts)
- **New layout?** Add under `layouts/`, attach it as the parent route's `component` and put feature children inside
- **New protected route?** Add `canActivate: [authGuard]` on the parent route in the feature's routes file
- **New API call?** Put the service in `core/` (cross-feature) or `features/<name>/services/` (feature-scoped), inject `HttpClient`, type the response

## Backend coordination

- Backend repo is maintained by the teammate building the Spring Boot side
- Always keep the API contract section above in sync when endpoints change
- For local dev, you may need a `proxy.conf.json` to forward `/api` → `http://localhost:8080` to avoid CORS friction
