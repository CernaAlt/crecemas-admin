import { Routes } from '@angular/router';
import { AdminReservationsComponent } from './dashboard/components/admin-reservations/admin-reservations.component';
import { SimuladorCreditosComponent } from './vista_Cliente/simulador-creditos/simulador-creditos.component';
import { ReservasClientesComponent } from './vista_Cliente/reservas-clientes/reservas-clientes.component';
import { LoginComponent } from './vista_Cliente/components/login/login.component';
import { authGuard } from './supabase/auth.guard';

export const routes: Routes = [
  {
    path: 'simulador-creditos',
    component: SimuladorCreditosComponent, // página por defecto
  },
  {
    path: 'solicitud',
    component: ReservasClientesComponent, // página por defecto
  },

  { path: 'login', component: LoginComponent },



  {
    path: 'admin',
    component: AdminReservationsComponent,
    canActivate: [authGuard], //Protegida
  },
];
