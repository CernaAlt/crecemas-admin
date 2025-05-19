import { Routes } from '@angular/router';
import { SimuladorCreditosComponent } from './client/vista_Cliente/simulador-creditos/simulador-creditos.component';
import { LoginUserComponent } from './login/login-user/login-user.component';
import { ProfileUserComponent } from './client/vista_Cliente/components/profile-user/profile-user.component';
import { RegisterUserComponent } from './login/register-user/register-user.component';
import { AuthGuard } from './guards/auth.guard';
import { PanelControlAdminComponent } from './admin/vista_Admin/components/panel-control-admin/panel-control-admin.component';
import { AdminGuard } from './guards/admin.guard';
import { SocioGuard } from './guards/socio.guard';
import { SocioPanelComponent } from './socio/components/socio-panel/socio-panel.component';
import { ReservasClientesComponent } from './client/vista_Cliente/reservas-clientes/reservas-clientes.component';




export const routes: Routes = [
  //Rutas publicas
  {path: 'simulador-creditos', component: SimuladorCreditosComponent},
  {path: 'reservas', component: ReservasClientesComponent },
  {path: 'register', component: RegisterUserComponent},

  //Rutas protegidas
  { path: 'admin-panel', component: PanelControlAdminComponent, canActivate: [AdminGuard] },
  { path: 'socio-panel', component: SocioPanelComponent, canActivate: [SocioGuard] },
  { path: 'profile', component: ProfileUserComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginUserComponent },

  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a login si no encuentra la ruta
  { path: '**', redirectTo: '/login' } // Ruta comodin
  
];
