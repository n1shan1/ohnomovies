// DTOs for auth
export interface AuthResponse {
  token: string;
}
export interface LoginRequest {
  email: string;
  password: any;
}
export interface RegisterRequest {
  email: string;
  password: any;
  firstName: string;
  lastName: string;
}
