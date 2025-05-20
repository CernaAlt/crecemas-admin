// src/app/services/prestamos.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../../../supabase/supabase-client';
import { Prestamo } from '../interfaces/Prestamo';

@Injectable({
  providedIn: 'root',
})
export class PrestamosService {
  private table = 'prestamos';

  async getAll(): Promise<Prestamo[]> {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Prestamo | null> {
    const { data, error } = await supabase.from(this.table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(prestamo: Prestamo): Promise<Prestamo> {
    const { data, error } = await supabase.from(this.table).insert(prestamo).select().single();
    if (error) throw error;
    return data;
  }

  async update(id: string, prestamo: Partial<Prestamo>): Promise<Prestamo> {
    const { data, error } = await supabase.from(this.table).update(prestamo).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }
}
