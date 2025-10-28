import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected readonly BASE_URL = environment.apiUrl;
  constructor(protected http: HttpClient) {}

  get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | string[]>
  ): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<T>(`${this.BASE_URL}${endpoint}`, {
      params: httpParams,
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.BASE_URL}${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.BASE_URL}${endpoint}`, data);
  }

  patch<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.patch<T>(`${this.BASE_URL}${endpoint}`, data);
  }

  delete<T>(
    endPoint: string,
    params?: Record<string, string | number | boolean | string[]>
  ): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    return this.http.delete<T>(`${this.BASE_URL}${endPoint}`, {
      params: httpParams,
    });
  }

  private buildHttpParams(
    params?: Record<string, string | number | boolean | string[]>
  ): HttpParams {
    let httpParams = new HttpParams();

    if (!params || typeof params !== 'object') {
      return httpParams;
    }

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            httpParams = httpParams.append(key, String(item).trim());
          });
        } else {
          httpParams = httpParams.append(key, String(value).trim());
        }
      }
    });

    return httpParams;
  }
}
