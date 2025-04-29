import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from './supabase-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = false;

  constructor(private router: Router) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      this._isLoggedIn = !!session;
      if (this._isLoggedIn) {
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        localStorage.removeItem('isLoggedIn');
      }
    });
  }
  
  async login(dni: string, password: string): Promise<boolean> {
    try {
      const email = `${dni}@crecemas.com`;
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
  
      if (error) {
        console.error('Login error:', error.message);
        return false;
      }
  
      this._isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      return true;
  
    } catch (err) {
      console.error('Unexpected login error:', err);
      return false;
    }
  }

  logout(): void {
    supabase.auth.signOut();
    this._isLoggedIn = false;
    localStorage.removeItem('isLoggedIn'); // Esta línea es importante
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const localFlag = localStorage.getItem('isLoggedIn') === 'true';
  
    // Devuelve true si ya está logueado o si el flag está guardado
    return this._isLoggedIn || localFlag;
  }
  
  

  async register(dni: string, password: string): Promise<boolean> {
    try {
      const email = `${dni}@crecemas.com`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error en registro:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Unexpected registration error:', err);
      return false;
    }
  }

  async initializeSession(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    this._isLoggedIn = !!session;
  
    if (this._isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isLoggedIn');
    }
  }
  
}
