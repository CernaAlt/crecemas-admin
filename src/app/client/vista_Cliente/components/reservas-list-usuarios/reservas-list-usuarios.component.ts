import { Component } from '@angular/core';
import { Reservation } from '../../../../admin/vista_Admin/interfaces/Reservation';
import { Usuario } from '../../../../admin/vista_Admin/interfaces/Usuario';
import { ReservasService } from '../../../../services/reservas.service';
import { supabase } from '../../../../supabase/supabase-client';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-reservas-list-usuarios',
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './reservas-list-usuarios.component.html',
  styleUrl: './reservas-list-usuarios.component.css'
})
export class ReservasListUsuariosComponent {
  reservas: Reservation[] = [];
  loading = true;
  usuario?: Usuario;

  constructor(private reservaService: ReservasService) {}

  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();
    const authUserId = user?.id;
    if (!authUserId) return;

    // 🔍 Buscar usuario por auth_user_id para obtener su DNI
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (error || !data) {
      console.error('Error obteniendo usuario:', error);
      this.loading = false;
      return;
    }

    this.usuario = data;

    try {
     if (this.usuario) {
        this.reservas = await this.reservaService.getReservasPorDni(this.usuario.dni);
      }
    } catch (error) {
      console.error('Error cargando reservas:', error);
    } finally {
      this.loading = false;
    }
  }
}
