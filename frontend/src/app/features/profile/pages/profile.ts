import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable } from 'rxjs';
import { User, Role } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { UpdateProfileRequest } from '../../../core/models/backend-dtos';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    DividerModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  currentUser$: Observable<User | null>;
  profileForm: FormGroup;
  isLoading: boolean = false;
  isLoadingProfile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.currentUser$ = this.authService.currentUser$;

    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    // Load user profile from backend API
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoadingProfile = true;

    // First, try to load from backend API
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        });

        // Update local user state with fresh data from backend
        this.authService.updateUserProfile(profile.firstName, profile.lastName);

        // Email is read-only
        this.profileForm.get('email')?.disable();
        this.isLoadingProfile = false;
      },
      error: (error) => {
        // Fallback to JWT token data if API fails
        this.currentUser$.subscribe((user) => {
          if (user) {
            this.profileForm.patchValue({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            });

            // Email is read-only
            this.profileForm.get('email')?.disable();
          }
        });

        this.isLoadingProfile = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Could not load latest profile data. Showing cached data.',
          life: 3000,
        });
      },
    });
  }

  getInitials(user: User | null): string {
    if (!user) return '??';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || user.email[0].toUpperCase();
  }

  getRoleLabel(role: Role | undefined): string {
    switch (role) {
      case Role.ADMIN:
        return 'Administrator';
      case Role.STAFF:
        return 'Staff Member';
      case Role.USER:
        return 'User';
      default:
        return 'Unknown';
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const updateRequest: UpdateProfileRequest = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
    };

    this.userService.updateProfile(updateRequest).subscribe({
      next: (updatedProfile) => {
        this.isLoading = false;

        // Update local user state
        this.authService.updateUserProfile(updatedProfile.firstName, updatedProfile.lastName);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully!',
          life: 3000,
        });

        // Mark form as pristine after successful save
        this.profileForm.markAsPristine();
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update profile. Please try again.',
          life: 3000,
        });
      },
    });
  }
}
