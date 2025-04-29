import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SimuladorCreditosComponent } from "./vista_Cliente/simulador-creditos/simulador-creditos.component";
import { ReservasClientesComponent } from "./vista_Cliente/reservas-clientes/reservas-clientes.component";
import { AdminReservationsComponent } from './dashboard/components/admin-reservations/admin-reservations.component';
import { LoginComponent } from './vista_Cliente/components/login/login.component';
import { AuthService } from './supabase/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crecemas_Dashboard';

  constructor(private authService: AuthService) {
    this.authService.initializeSession();
  }
  
}
