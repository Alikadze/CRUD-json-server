import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.apiUrl;

  http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, user);
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/users/${user.id}`;
    return this.http.put<User>(url, user);
  }

  deleteUser (id: string): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/users/${id}`)
  }
}
