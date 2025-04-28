import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SimuladorCreditosComponent } from "./vista_Cliente/simulador-creditos/simulador-creditos.component";
import { ReservasClientesComponent } from "./vista_Cliente/reservas-clientes/reservas-clientes.component";
import { AdminReservationsComponent } from './dashboard/components/admin-reservations/admin-reservations.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crecemas_Dashboard';
}
