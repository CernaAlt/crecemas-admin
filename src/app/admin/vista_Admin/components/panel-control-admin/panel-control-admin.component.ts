import { Component, OnInit } from '@angular/core';
import { UserDataComponent } from '../user-data/user-data.component';
import { SociosListComponent } from '../socios-list/socios-list.component';
import { PrestamosListComponent } from "../info-prestamos/prestamos-list/prestamos-list.component";
import { NgIf } from '@angular/common';
import { AdminReservationsComponent } from "../admin-reservations/admin-reservations.component";
import { LogoutUserComponent } from '../../../../login/logout-user/logout-user.component';
import { GeneradorContratosComponent } from "../../../generador-contratos/generador-contratos.component";
import { AjustesComponent } from "../../../ajustes/ajustes.component";
import { Usuario } from '../../../../interfaces/Usuario';
import { AuthService } from '../../../../services/auth/auth.service';


@Component({
  selector: 'app-panel-control-admin',
  imports: [
    NgIf,
    UserDataComponent,
    SociosListComponent,
    PrestamosListComponent,
    LogoutUserComponent,
    AdminReservationsComponent,
    GeneradorContratosComponent,
    AjustesComponent
],
  templateUrl: './panel-control-admin.component.html',
  styleUrl: './panel-control-admin.component.css',
})
export class PanelControlAdminComponent implements OnInit{

  //Codigo para cargar del administrador que a iniciado sesion
  usuario: any; 
  error: String='';

  constructor(private authservice: AuthService){}


  async ngOnInit() {
    const {user, error} = await this.authservice.getCompleteUserData();

    if (error || !user ){
      this.error='No se puedo cargar la informacion del usuario'
      console.error(error);
      return;

    }

    this.usuario=user;

  }


  //Codigo de Diseño
  vistaActual: string = 'reservaciones';

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }
}
