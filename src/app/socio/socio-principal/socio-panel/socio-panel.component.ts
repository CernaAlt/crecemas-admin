import { Component } from '@angular/core';
import { PrestamosSocioComponent } from '../../socio-children/components/prestamos-socio/prestamos-socio.component';
import { NgIf } from '@angular/common';
import { LogoutUserComponent } from '../../../login/logout-user/logout-user.component';

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
