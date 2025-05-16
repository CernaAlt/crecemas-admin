import { Routes } from '@angular/router';
import { SimuladorCreditosComponent } from './client/vista_Cliente/simulador-creditos/simulador-creditos.component';
import { ReservasClientesComponent } from './client/vista_Cliente/reservas-clientes/reservas-clientes.component';
import { AdminReservationsComponent } from './admin/vista_Admin/components/admin-reservations/admin-reservations.component';
import { LoginUserComponent } from './login/login-user/login-user.component';
import { LogoutUserComponent } from './client/vista_Cliente/components/logout-user/logout-user.component';
import { ProfileUserComponent } from './client/vista_Cliente/components/profile-user/profile-user.component';
import { RegisterUserComponent } from './login/register-user/register-user.component';
import { AuthGuard } from './guards/auth.guard';




export const routes: Routes = [
  {
    path: 'simulador-creditos',
    component: SimuladorCreditosComponent, // página por defecto
  },
  {
    path: 'solicitud',
    component: ReservasClientesComponent, // página por defecto
  },

  /*
  { path: 'login', component: LoginComponent },

  {path:  'socio' ,component:SocioComponent},

  {path:  'usuarios' ,component:UsuarioComponent},

  {path:  'loginUsuario' ,component:LoginUsuarioComponent},
  */

  { path: 'login', component: LoginUserComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'logout', component: LogoutUserComponent },

  { path: 'profile', component: ProfileUserComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },

  /*{
    path: 'admin',
    component: AdminReservationsComponent,
    //canActivate: [authGuard],
  },*/
];
