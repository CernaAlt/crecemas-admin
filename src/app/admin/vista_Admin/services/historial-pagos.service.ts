import { Injectable } from '@angular/core';
import { HistorialPago } from '../interfaces/historial-pago.model';
import { supabase } from '../../../supabase/supabase-client';
import { PrestamosService } from './prestamos.service';

@Injectable({
  providedIn: 'root',
})
export class HistorialPagosService {
  private table = 'historial_pagos';

  async getAll(): Promise<HistorialPago[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .order('fecha_pago', { ascending: true });
    if (error) throw error;
    return data as HistorialPago[];
  }

  async getById(id: string): Promise<HistorialPago | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as HistorialPago;
  }

  async create(pago: HistorialPago): Promise<void> {
    const { error } = await supabase.from(this.table).insert(pago);
    if (error) throw error;
  }

  async update(id: string, pago: Partial<HistorialPago>): Promise<void> {
    const { error } = await supabase.from(this.table).update(pago).eq('id', id);
    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }

  // historial-pagos.service.ts
  async getCuotasPagadasPorPrestamo(prestamoId: string): Promise<number[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('cuota_numero')
      .eq('prestamo_id', prestamoId);

    if (error) throw error;

    return (data || []).map((p) => p.cuota_numero);
  }
}
