import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UpdateProfileRequest, UserProfileDto } from '../models/backend-dtos';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Get current user profile
   */
  getProfile(): Observable<UserProfileDto> {
    return this.apiService.get<UserProfileDto>('/users/me');
  }

  /**
   * Update user profile (firstName, lastName)
   */
  updateProfile(request: UpdateProfileRequest): Observable<UserProfileDto> {
    return this.apiService.put<UserProfileDto>('/users/me', request);
  }
}
