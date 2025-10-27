import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'pi-home', route: 'dashboard' },
  { label: 'Movies', icon: 'pi-video', route: 'movies' },
  { label: 'Theaters', icon: 'pi-building', route: 'theaters' },
  { label: 'Showtimes', icon: 'pi-calendar', route: 'showtimes' },
  { label: 'Bookings', icon: 'pi-ticket', route: 'bookings' },
];

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    ButtonModule,
    AvatarModule,
    MenuModule,
    TooltipModule,
    BadgeModule,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {
  navItems = NAV_ITEMS;
  currentUser$: Observable<User | null>;
  userMenuItems: MenuItem[] = [];
  sidebarCollapsed = false;

  constructor(public authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.userMenuItems = [
      {
        label: 'Back to Site',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/']),
      },
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile']),
      },
      { separator: true },
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout(),
      },
    ];
  }

  getInitials(user: User | null): string {
    if (!user) return '??';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || user.email[0].toUpperCase();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
