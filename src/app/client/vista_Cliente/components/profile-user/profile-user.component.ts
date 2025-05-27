import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { DatePipe, NgIf } from '@angular/common';
import { LogoutUserComponent } from '../logout-user/logout-user.component';
import { GetRoleNamePipe } from '../../../../pipes/get-role-name.pipe';
import { ReservasClientesComponent } from '../../reservas-clientes/reservas-clientes.component';
import { AdminReservationsComponent } from '../../../../admin/vista_Admin/components/admin-reservations/admin-reservations.component';
import { ReservasListUsuariosComponent } from '../reservas-list-usuarios/reservas-list-usuarios.component';
import { CalificacionesFormComponent } from '../../calificaciones/calificaciones-form/calificaciones-form.component';
import { SimuladorCreditosComponent } from '../../simulador-creditos/simulador-creditos.component';

@Component({
  selector: 'app-profile-user',
  imports: [
    NgIf,
    LogoutUserComponent,
    DatePipe,
    GetRoleNamePipe,
    AdminReservationsComponent,
    CalificacionesFormComponent,
    SimuladorCreditosComponent,
  ],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css',
})
export class ProfileUserComponent {
  vistaActual: string = 'reservaciones';

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }

  user: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

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
