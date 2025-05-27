// src/app/services/reservas.service.ts
import { Injectable } from '@angular/core';
import { Reservation } from '../admin/vista_Admin/interfaces/Reservation';
import { supabase } from '../supabase/supabase-client';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  constructor() {}

  async getReservasPorDni(dni: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('ReservasCreditos')
      .select('*')
      .eq('DNI', dni);

    if (error) throw error;
    return data;
  }
}
