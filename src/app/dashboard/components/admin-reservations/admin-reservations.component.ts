import { Component, OnInit } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../../supabase/supabase-client';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Reservation } from '../../interfaces/Reservation';


@Component({
  selector: 'app-admin-reservations',
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './admin-reservations.component.html',
  styleUrl: './admin-reservations.component.css'
})
export class AdminReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true; // Variable para controlar el estado de carga
  error='';

  private supabase: SupabaseClient;

  constructor(){
    this.supabase = supabase;
  }

  async ngOnInit() {
    await this.loadReservations();
  }


  async loadReservations() {
    try {
      this.loading = true;
      
      const { data, error } = await this.supabase
        .from('ReservasCreditos')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      this.reservations = data as Reservation[];
      this.error = '';
    } catch (err: any) {
      this.error = err.message || 'Error al cargar las reservaciones';
    } finally {
      this.loading = false;
    }
  }

  async toggleAttended(reservation: Reservation) {
    try {
      const { error } = await this.supabase
        .from('ReservasCreditos')
        .update({ atendido: !reservation.atendido })
        .eq('id', reservation.id);
        
      if (error) throw error;
      
      // Actualizar el estado local después de la actualización exitosa
      reservation.atendido = !reservation.atendido;
    } catch (err: any) {
      alert('Error al actualizar el estado: ' + (err.message || 'Error desconocido'));
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
