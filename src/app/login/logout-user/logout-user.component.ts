import { Component } from '@angular/core';
//import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-logout-user',
  imports: [],
  templateUrl: './logout-user.component.html',
  styleUrl: './logout-user.component.css'
})
export class LogoutUserComponent {
  constructor(private authService: AuthService, private router: Router) {}

  async logout() {
    const response = await this.authService.signOut();
    if (response.error) {
      alert(`Error al cerrar sesión: ${response.error}`);
    } else {
      alert(response.message);
      this.router.navigate(['/login']);
    }
  }

}
