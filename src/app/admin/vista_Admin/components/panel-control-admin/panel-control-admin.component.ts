import { Component } from '@angular/core';
import { UserDataComponent } from '../user-data/user-data.component';
import { SociosListComponent } from '../socios-list/socios-list.component';
import { PrestamosListComponent } from "../info-prestamos/prestamos-list/prestamos-list.component";
import { NgIf } from '@angular/common';
import { AdminReservationsComponent } from "../admin-reservations/admin-reservations.component";
import { LogoutUserComponent } from '../../../../login/logout-user/logout-user.component';
import { GeneradorContratosComponent } from "../../../generador-contratos/generador-contratos.component";
import { AjustesComponent } from "../../../ajustes/ajustes.component";

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
export class PanelControlAdminComponent {


  vistaActual: string = 'reservaciones';

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }
}
