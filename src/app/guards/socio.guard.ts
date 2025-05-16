import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class SocioGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const role = await this.authService.getCurrentUserRole();
    const isSocio = role === 'a5b3425b-207a-4ab6-a5d6-2f06c3801ada'; // Reemplaza con el ID real
    
    if (!isSocio) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  }
}