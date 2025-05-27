import { Component } from '@angular/core';
import { UserDataComponent } from '../user-data/user-data.component';
import { SociosListComponent } from '../socios-list/socios-list.component';
import { PrestamosListComponent } from "../info-prestamos/prestamos-list/prestamos-list.component";
import { NgIf } from '@angular/common';
import { LogoutUserComponent } from "../../../../client/vista_Cliente/components/logout-user/logout-user.component";
import { AdminReservationsComponent } from "../admin-reservations/admin-reservations.component";

@Component({
  selector: 'app-panel-control-admin',
  imports: [
    NgIf,
    UserDataComponent,
    SociosListComponent,
    PrestamosListComponent,
    LogoutUserComponent,
    AdminReservationsComponent
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
