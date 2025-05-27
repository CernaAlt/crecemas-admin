import { Component } from '@angular/core';
import { CalificacionesService } from '../../../../services/calificaciones.service';
import { supabase } from '../../../../supabase/supabase-client';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calificaciones-form',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './calificaciones-form.component.html',
  styleUrl: './calificaciones-form.component.css',
})
export class CalificacionesFormComponent {
  puntuacion = 5;
  comentario = '';
  servicio = '';
  enviado = false;
  loading = false;

  // Servicios disponibles en la financiera
  serviciosDisponibles = [
    'Préstamos Personales',
    'Créditos Hipotecarios',
    'Atención al cliente',
    'Página web',
    'Servicios en oficina',
  ];

  constructor(private calificacionesService: CalificacionesService) {}

  async enviar() {
    this.loading = true;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Debes iniciar sesión para calificar.');
      this.loading = false;
      return;
    }

    try {
      await this.calificacionesService.enviarCalificacion({
        usuario_id: user.id, // auth_user_id
        puntuacion: this.puntuacion,
        comentario: this.comentario,
        servicio: this.servicio,
      });
      this.enviado = true;
    } catch (error) {
      console.error('Error al enviar calificación:', error);
      alert('Error al enviar tu calificación.');
    } finally {
      this.loading = false;
    }
  }
}
