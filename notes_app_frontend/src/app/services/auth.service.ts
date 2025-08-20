import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);

  // PUBLIC_INTERFACE
  /** Returns current user signal; null means unauthenticated. */
  user = this._user.asReadonly();

  // PUBLIC_INTERFACE
  /** Fake login that sets an in-memory user; replace with real integration if backend supports it. */
  login(email: string): void {
    this._user.set({ id: 'demo', email });
  }

  // PUBLIC_INTERFACE
  /** Logs out the current user. */
  logout(): void {
    this._user.set(null);
  }
}
