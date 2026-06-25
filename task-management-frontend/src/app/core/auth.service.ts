import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiResponse, AuthResponse, User } from './api.models';
import { PathConfig } from './path.config';

const TOKEN_KEY = 'task_management_token';
const USER_KEY = 'task_management_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    this.loadAuthData();
  }

  login(payload: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(PathConfig.AUTH_LOGIN, payload)
      .pipe(tap((response) => this.storeAuthData(response.data)));
  }

  register(payload: {
    username: string;
    email: string;
    password: string;
  }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(PathConfig.AUTH_REGISTER, payload);
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigateByUrl('/login');
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    const token = this.token;

    if (!token || !this.currentUser() || !this.isTokenValid(token)) {
      this.clearAuthData();
      return false;
    }

    return true;
  }

  updateCurrentUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private storeAuthData(data: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }

  private loadAuthData(): void {
    const token = this.token;
    const user = this.getStoredUser();

    if (!token || !user || !this.isTokenValid(token)) {
      this.clearAuthData();
      return;
    }

    this.currentUser.set(user);
  }

  private isTokenValid(token: string): boolean {
    try {
      const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')));
      return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  private getStoredUser(): User | null {
    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as User;
    } catch {
      return null;
    }
  }
}
