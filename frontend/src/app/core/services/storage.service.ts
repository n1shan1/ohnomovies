import { Injectable } from '@angular/core';
import { User } from '../models/user.model'; // Use the User model we defined

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // Updated keys for ohnomovies project
  private readonly TOKEN_KEY = 'ohnomovies_jwt_token';
  private readonly USER_KEY = 'ohnomovies_user';
  constructor() {}

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token;
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? (JSON.parse(user) as User) : null;
  }

  removeUser() {
    localStorage.removeItem(this.USER_KEY);
  }

  clearAll() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  // --- Generic Storage Methods ---

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    // Corrected: added return
    return localStorage.getItem(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  setSessionItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  getSessionItem(key: string): string | null {
    // Corrected: added return
    return sessionStorage.getItem(key);
  }

  removeSessionItem(key: string) {
    sessionStorage.removeItem(key);
  }
}
