import { Component } from '@angular/core';
import { PrestamosSocioComponent } from '../../socio-children/components/prestamos-socio/prestamos-socio.component';
import { LogoutUserComponent } from '../../../client/vista_Cliente/components/logout-user/logout-user.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-socio-panel',
  imports: [LogoutUserComponent, NgIf, PrestamosSocioComponent],
  templateUrl: './socio-panel.component.html',
  styleUrl: './socio-panel.component.css',
})
export class SocioPanelComponent {
  vistaActual: string = 'prestamosSocio';

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }
}
