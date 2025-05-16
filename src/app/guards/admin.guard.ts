import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const role = await this.authService.getCurrentUserRole();
    const isAdmin = role === '5bd36ddb-25ab-4560-ae97-07a8d983e477'; // Reemplaza con el ID real
    
    if (!isAdmin) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  }
}