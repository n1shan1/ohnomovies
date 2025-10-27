export interface UserProfileDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface MovieDto {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  releaseDate: string;
  durationInMinutes: number;
  language: string;
}

export interface CreateMovieRequest {
  title: string;
  description: string;
  posterUrl: string;
  releaseDate: string;
  durationInMinutes: number;
  language?: string;
}

export interface TheaterDto {
  id: number;
  name: string;
  location: string;
  screens: ScreenDto[];
}

export interface TheaterRequest {
  name: string;
  location: string;
}

export interface ScreenDto {
  id: number;
  screenName: string;
  totalRows: number;
  totalColumns: number;
}

export interface ScreenRequest {
  screenName: string;
  totalRows: number;
  totalColumns: number;
}

export interface SeatDto {
  id: number;
  seatRow: string;
  seatNumber: number;
}

export interface ShowtimeDto {
  id: number;
  startTime: string;
  endTime: string;
  price: number;
  movieId: number;
  movieTitle: string;
  screenId: number;
  screenName: string;
  theaterId: number;
  theaterName: string;
}

export interface ShowtimeRequest {
  movieId: number;
  screenId: number;
  startTime: string;
  price: number;
}

export interface ShowtimeSeatDto {
  id: number;
  seatRow: string;
  seatNumber: number;
  status: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
  version: number;
}

export interface BookingResponse {
  bookingUuid: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'EXPIRED' | 'USED';
  movieTitle: string;
  theaterName: string;
  screenName: string;
  startTime: string;
  seats: string[];
  totalAmount: number;
  currency: string;
  bookedAt: string;
}

export interface BookingRequest {
  showtimeSeatIds: number[];
}

export interface SeatLockRequest {
  showtimeSeatId: number;
}

export interface BookingVerificationRequest {
  bookingUuid: string;
}

export interface BookingVerificationResponse {
  valid: boolean;
  message: string;
  bookingDetails: BookingResponse | null;
}

export type ShowtimeSeatStatus = 'AVAILABLE' | 'LOCKED' | 'BOOKED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | 'USED';
export type Currency = 'INR' | 'USD' | 'EUR';
export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';
