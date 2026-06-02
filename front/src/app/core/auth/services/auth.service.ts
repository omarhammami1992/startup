import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';

import { environment } from '@env/environment';

import type {
  LoginCredentials,
  PasswordResetConfirm,
  PasswordResetRequest,
  RegisterPayload,
} from '../models/credentials.model';
import type { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly loadedSignal = signal(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isLoaded = this.loadedSignal.asReadonly();

  login(credentials: LoginCredentials): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/login`, credentials)
      .pipe(tap((user) => this.setUser(user)));
  }

  register(payload: RegisterPayload): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, payload);
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/logout`, {})
      .pipe(tap(() => this.clearUser()));
  }

  me(): Observable<User | null> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap((user) => this.setUser(user)),
      catchError(() => {
        this.clearUser();
        return of(null);
      }),
    );
  }

  loadSession(): Observable<User | null> {
    return this.me().pipe(tap(() => this.loadedSignal.set(true)));
  }

  requestPasswordReset(payload: PasswordResetRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/password/reset-request`, payload);
  }

  confirmPasswordReset(payload: PasswordResetConfirm): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/password/reset-confirm`, payload);
  }

  private setUser(user: User | null): void {
    this.currentUserSignal.set(user);
  }

  private clearUser(): void {
    this.currentUserSignal.set(null);
  }
}
