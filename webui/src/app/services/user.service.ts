import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = `${environment.BASE_URL}/users`;
  constructor(
    private http: HttpClient
  ) { }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/profile`);
  }

  updateUserProfile(data: FormData): Observable<any> {
    return this.http.put(`${this.BASE_URL}/update-profile`, data);
  }

  getImage(fileName: string): Observable<Blob> {
    return this.http.get(`${this.BASE_URL}/image?filename=${fileName}`, {
      responseType: 'blob',
    });
  }  
}
