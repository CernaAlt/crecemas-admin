import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private validEmail = 'admin@crecmas.com';
  private validPassword = '123456';

  private _isLoggedIn = false;

  constructor() {
    const stored = localStorage.getItem('isLoggedIn');
    if (stored === 'true') {
      this._isLoggedIn = true;
    }
  }


  login(email: string, password: string): boolean {
    if (email === this.validEmail && password === this.validPassword) {
      this._isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true'); // ✅ guardar sesión
      return true;
    }
    return false;
  }

  logout(): void {
    this._isLoggedIn = false;
    localStorage.removeItem('isLoggedIn'); //cerrar sesión
  }

  isAuthenticated(): boolean {
    return this._isLoggedIn;
  }
}
