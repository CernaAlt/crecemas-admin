import { Component } from '@angular/core';
import { AdminReservationsComponent } from '../admin-reservations/admin-reservations.component';
import { RegisterUserComponent } from '../../../../login/register-user/register-user.component';
import { UserDataComponent } from "../user-data/user-data.component";
import { SociosListComponent } from "../socios-list/socios-list.component";


@Component({
  selector: 'app-panel-control-admin',
  imports: [AdminReservationsComponent, RegisterUserComponent, UserDataComponent, SociosListComponent],
  templateUrl: './panel-control-admin.component.html',
  styleUrl: './panel-control-admin.component.css'
})
export class PanelControlAdminComponent {

}
