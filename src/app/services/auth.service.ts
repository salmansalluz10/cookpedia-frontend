import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<any>(this.readUser());
  private readUser() {
    try {
      return JSON.parse(sessionStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }
  get token() {
    return sessionStorage.getItem('token');
  }
  get signedIn() {
    return !!this.token && !!this.user();
  }
  get admin() {
    return String(this.user()?.role).toLowerCase() === 'admin';
  }
  setSession(user: any, token: string) {
    sessionStorage.setItem('token', token);
    this.updateUser(user);
  }
  updateUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.user.set(user);
  }
  clear() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('chart');
    this.user.set(null);
  }
}
