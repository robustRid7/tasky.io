import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private BASE_URL = `${environment.BASE_URL}/users`;

  constructor(private http: HttpClient) { }

  signup(userData: any): Observable<any> {
    const { confirmPassword, ...filteredData } = userData;
    return this.http.post(`${this.BASE_URL}/signup`, filteredData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, userData);
  }

  isUserIdAvailable(userId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/check?userId=${userId}`);
  }

  sendResetLink(userData: any): Observable<any> {
    const { confirmPassword, ...filteredData } = userData;
  
    const payload = {
      userId: filteredData.userId,
      password: filteredData.newPassword,
    };
  
    return this.http.post(`${this.BASE_URL}/send-reset-link`, payload);
  }  
}
