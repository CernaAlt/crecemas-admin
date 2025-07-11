import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const { data, error } = await this.authService.getUser();

    if (error || !data.user) {
      alert('No tienes acceso, por favor inicia sesión.');
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
