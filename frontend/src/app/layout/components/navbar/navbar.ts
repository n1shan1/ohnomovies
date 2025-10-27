import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role, User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG Modules
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { Drawer } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    ChipModule,
    Drawer,
    DividerModule,
  ],
  templateUrl: './navbar.html',
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  isAdmin$: Observable<boolean>;

  profileMenuItems: MenuItem[] = [];
  mobileMenuVisible: boolean = false;

  Role = Role;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
    this.isAdmin$ = this.authService.currentUser$.pipe(
      map((user: User | null) => user?.role === Role.ADMIN)
    );
  }

  ngOnInit(): void {
    this.profileMenuItems = [
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        command: () => this.navigate('/profile'),
      },
      {
        label: 'My Bookings',
        icon: 'pi pi-ticket',
        command: () => this.navigate('/my-bookings'),
      },
      { separator: true },
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout(),
      },
    ];
  }

  toggleMobileMenu(): void {
    this.mobileMenuVisible = !this.mobileMenuVisible;
  }

  closeMobileMenu(): void {
    this.mobileMenuVisible = false;
  }

  navigateAndCloseMobile(url: string): void {
    this.navigate(url);
    this.closeMobileMenu();
  }

  getInitials(user: User | null): string {
    if (!user) return '??';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || user.email[0].toUpperCase();
  }

  getRoleLabel(user: User | null): string {
    if (!user) return '';
    switch (user.role) {
      case Role.ADMIN:
        return 'Admin';
      case Role.STAFF:
        return 'Staff';
      case Role.USER:
        return 'User';
      default:
        return '';
    }
  }

  getRoleSeverity(
    user: User | null
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
    if (!user) return undefined;
    switch (user.role) {
      case Role.ADMIN:
        return 'danger';
      case Role.STAFF:
        return 'warning';
      case Role.USER:
        return 'success';
      default:
        return 'secondary';
    }
  }

  navigate(url: string): void {
    this.router.navigate([url]);
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }
}
