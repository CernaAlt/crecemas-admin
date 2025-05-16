import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { DatePipe, NgIf } from '@angular/common';
import { LogoutUserComponent } from "../logout-user/logout-user.component";
import { GetRoleNamePipe } from "../../../../pipes/get-role-name.pipe";

@Component({
  selector: 'app-profile-user',
  imports: [NgIf, LogoutUserComponent, DatePipe, GetRoleNamePipe],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css'
})
export class ProfileUserComponent {
  user: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private authService:AuthService,
  ){}

  async ngOnInit() {
    try {
      const { user, error } = await this.authService.getCompleteUserData();
      
      if (error) {
        this.errorMessage = 'Error al cargar el perfil: ' + error;
        console.error(this.errorMessage);
      } else {
        this.user = user;
        
        // Verificar si existen los datos adicionales
        if (!user.dni) {
          this.errorMessage = 'Perfil incompleto: faltan datos adicionales';
        }
      }
    } catch (e) {
      this.errorMessage = 'Error inesperado al cargar el perfil';
      console.error(this.errorMessage, e);
    } finally {
      this.isLoading = false;
    }
  }
}
