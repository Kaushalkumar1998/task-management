import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse, PaginatedResponse, Role, User } from './api.models';
import { PathConfig } from './path.config';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<ApiResponse<PaginatedResponse<User>>> {
    const params = new HttpParams().set('page', 1).set('limit', 100);

    return this.http.get<ApiResponse<PaginatedResponse<User>>>(PathConfig.USERS, { params });
  }

  getAssignableUsers(): Observable<User[]> {
    const params = new HttpParams().set('page', 1).set('limit', 100);

    return this.http
      .get<ApiResponse<PaginatedResponse<User>>>(PathConfig.USERS, { params })
      .pipe(map((response) => response.data.items));
  }

  createUser(payload: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: Role;
    teamLeadId?: string;
  }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(PathConfig.USERS, payload);
  }

  updateUser(userId: string, payload: Partial<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    teamLeadId: string;
  }>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${PathConfig.USER_BY_ID}/${userId}`, payload);
  }

  deleteUser(userId: string): Observable<ApiResponse<{ userId: string }>> {
    return this.http.delete<ApiResponse<{ userId: string }>>(`${PathConfig.USER_BY_ID}/${userId}`);
  }
}
