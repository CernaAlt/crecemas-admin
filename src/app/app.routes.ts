import { Routes } from '@angular/router';
import { SimuladorCreditosComponent } from './client/vista_Cliente/simulador-creditos/simulador-creditos.component';
import { LoginUserComponent } from './login/login-user/login-user.component';
import { ProfileUserComponent } from './client/vista_Cliente/components/profile-user/profile-user.component';
import { AuthGuard } from './guards/auth.guard';
import { PanelControlAdminComponent } from './admin/vista_Admin/components/panel-control-admin/panel-control-admin.component';
import { AdminGuard } from './guards/admin.guard';
import { SocioGuard } from './guards/socio.guard';
import { SocioPanelComponent } from './socio/socio-principal/socio-panel/socio-panel.component';
import { PrestamosListComponent } from './admin/vista_Admin/components/info-prestamos/prestamos-list/prestamos-list.component';
import { AdminReservationsComponent } from './admin/vista_Admin/components/admin-reservations/admin-reservations.component';
import { UserDataComponent } from './admin/vista_Admin/components/user-data/user-data.component';
import { SociosListComponent } from './admin/vista_Admin/components/socios-list/socios-list.component';
import { ReservasClientesComponent } from './client/vista_Cliente/reservas-clientes/reservas-clientes.component';
import { RegisterUserComponent } from './login/register-user/register-user.component';
import { PrestamosSocioComponent } from './socio/socio-children/components/prestamos-socio/prestamos-socio.component';

export const routes: Routes = [


  // Rutas públicas
  { path: 'simulador-creditos', component: SimuladorCreditosComponent },
  { path: 'solicitud-creditos', component: ReservasClientesComponent },
  { path: 'register', component: RegisterUserComponent },

  // Rutas protegidas
  {
    path: 'admin-panel',
    component: PanelControlAdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'reservaciones', pathMatch: 'full' },
      //{ path: 'dashboard', component: DashboardComponent },
      { path: 'reservaciones', component: AdminReservationsComponent },
      { path: 'usuarios', component: UserDataComponent },
      { path: 'socios', component: SociosListComponent },
      { path: 'prestamos', component: PrestamosListComponent },
      //{ path: 'pagos', component:  },
      //{ path: 'ajustes', component: AjustesComponent },
    ],
  },
  {
    path: 'socio-panel',
    component: SocioPanelComponent,
    canActivate: [SocioGuard],
    children:[
      { path: '', redirectTo: 'prestamos', pathMatch: 'full' },
      //{ path: 'dashboard', component: DashboardComponent },
      { path: 'prestamos', component: PrestamosSocioComponent }
    ]
  },
  {
    path: 'profile',
    component: ProfileUserComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginUserComponent },

  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
