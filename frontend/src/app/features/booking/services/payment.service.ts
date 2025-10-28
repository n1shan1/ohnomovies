import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PaymentRequest {
  amount: number;
  currency: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  description?: string;
}

export interface PaymentResponse {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  refunded?: boolean;
  refundAmount?: number;
  errorMessage?: string;
  errorCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  processPayment(paymentData: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/process`, paymentData);
  }

  getPayment(paymentIntentId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/${paymentIntentId}`);
  }

  refundPayment(paymentIntentId: string, amount?: number): Observable<PaymentResponse> {
    const body = amount ? { amount } : {};
    return this.http.post<PaymentResponse>(`${this.apiUrl}/${paymentIntentId}/refund`, body);
  }
}
