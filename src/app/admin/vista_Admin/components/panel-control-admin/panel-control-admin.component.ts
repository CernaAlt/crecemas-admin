import { Component } from '@angular/core';
import { AdminReservationsComponent } from '../admin-reservations/admin-reservations.component';
import { RegisterUserComponent } from '../../../../login/register-user/register-user.component';


@Component({
  selector: 'app-panel-control-admin',
  imports: [AdminReservationsComponent, RegisterUserComponent],
  templateUrl: './panel-control-admin.component.html',
  styleUrl: './panel-control-admin.component.css'
})
export class PanelControlAdminComponent {

}
