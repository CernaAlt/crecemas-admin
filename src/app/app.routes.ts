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
import { HistorialPagosListComponent } from './admin/vista_Admin/components/info-pagos/historial-pagos-list/historial-pagos-list.component';
import { PrestamosListComponent } from './admin/vista_Admin/components/info-prestamos/prestamos-list/prestamos-list.component';


export const routes: Routes = [

  //Rutas nuevas prestamo
  { path: 'prestamos', component: PrestamosListComponent },

  //Rutas nuevas pagos
  { path: 'historial-pagos', component: HistorialPagosListComponent },
  
  
  
  
  // Rutas públicas
  { path: 'simulador-creditos', component: SimuladorCreditosComponent },
  { path: 'reservas', component: ReservasClientesComponent },
  { path: 'register', component: RegisterUserComponent },

  // Rutas protegidas
  { 
    path: 'admin-panel', 
    component: PanelControlAdminComponent, 
    canActivate: [AdminGuard] 
  },
  { 
    path: 'socio-panel', 
    component: SocioPanelComponent, 
    canActivate: [SocioGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileUserComponent, 
    canActivate: [AuthGuard] 
  },
  { path: 'login', component: LoginUserComponent },

  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
  
];
