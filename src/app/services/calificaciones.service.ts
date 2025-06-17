import { Injectable } from '@angular/core';
import { Calificacion } from '../interfaces/Calificacion';
import { supabase } from '../supabase/supabase-client';

@Injectable({ providedIn: 'root' })
export class CalificacionesService {
  async enviarCalificacion(calificacion: Calificacion): Promise<void> {
    const { error } = await supabase
      .from('calificaciones')
      .insert([calificacion]);
    if (error) throw error;
  }
}
