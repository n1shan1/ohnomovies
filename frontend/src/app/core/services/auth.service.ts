import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { User, Role } from '../models/user.model'; // Assuming this is in core/models
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.loadUserFromToken();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public hasRole(role: Role): boolean {
    return this.currentUserValue?.role === role;
  }

  /**
   * Tries to load user state from a token in storage.
   */
  private loadUserFromToken(): void {
    const token = this.storageService.getToken();
    if (token) {
      try {
        const user = this.decodeToken(token);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        // Invalid token, clear storage
        this.storageService.clearAll();
      }
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', request).pipe(
      tap((response) => {
        this.handleAuthSuccess(response);
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', request).pipe(
      tap((response) => {
        this.handleAuthSuccess(response);
      })
    );
  }

  logout(): void {
    // Call logout endpoint to clear the HttpOnly cookie
    this.apiService.post('/auth/logout', {}).subscribe({
      next: () => {
        this.storageService.clearAll();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/']);
      },
      error: () => {
        // Even if logout fails, clear local state
        this.storageService.clearAll();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/']);
      },
    });
  }

  /**
   * Update user profile in memory after successful profile update
   */
  updateUserProfile(firstName: string, lastName: string): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        firstName,
        lastName,
      };
      this.currentUserSubject.next(updatedUser);
      this.storageService.setUser(updatedUser);
    }
  }

  private handleAuthSuccess(response: AuthResponse): void {
    try {
      const user = this.decodeToken(response.token);

      // Store both token and user info
      this.storageService.setToken(response.token);
      this.storageService.setUser(user);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      throw error;
    }
  }

  private decodeToken(token: string): User {
    try {
      const decoded: any = jwtDecode(token);

      // Expected JWT payload structure from backend:
      // {
      //   sub: "user@email.com",          // Email (standard JWT claim)
      //   userId: 123,                     // User ID
      //   role: "ROLE_USER",              // User role
      //   firstName: "John",              // First name
      //   lastName: "Doe",                // Last name
      //   iat: 1234567890,                // Issued at
      //   exp: 1234567890                 // Expiration
      // }

      return {
        id: decoded.userId,
        email: decoded.sub,
        role: decoded.role as Role,
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
