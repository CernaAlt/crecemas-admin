// src/app/services/prestamos.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../../../supabase/supabase-client';
import { Prestamo } from '../interfaces/Prestamo';
import { HistorialPago } from '../interfaces/historial-pago.model';

@Injectable({
  providedIn: 'root',
})
export class PrestamosService {
  private table = 'prestamos';

  //Obtenemos todos los prestamos
  // y los datos del socio y usuario relacionados
  async getAll(): Promise<Prestamo[]> {
    const { data, error } = await supabase.from(this.table).select(`
      *,
      socio: socio_id (
        *,
        usuario: usuario_id (
          nombre,
          dni
        )
      )
    `);

    if (error) throw error;
    return data as Prestamo[];
  }

  async getById(id: string): Promise<Prestamo | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  /*async create(prestamo: Prestamo): Promise<Prestamo> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(prestamo)
      .select()
      .single();
    if (error) throw error;
    return data;
  }*/

  // En prestamos.service.ts
  async create(
    prestamo: Prestamo
  ): Promise<{ prestamo: Prestamo; cuotas: HistorialPago[] }> {
    // Validación básica
    if (
      !prestamo.socio_id ||
      prestamo.monto <= 0 ||
      prestamo.cuotas_totales <= 0
    ) {
      throw new Error('Datos del préstamo inválidos');
    }

    const { data, error } = await supabase
      .from(this.table)
      .insert(prestamo)
      .select()
      .single();

    if (error) {
      console.error('Error al crear préstamo:', error);
      throw new Error('No se pudo crear el préstamo');
    }

    const cuotas = await this.generarCuotas(
      data.id,
      data.monto,
      data.cuotas_totales,
      data.fecha_inicio
    );

    return { prestamo: data, cuotas };
  }

  // Método para generar las cuotas automáticamente
  private async generarCuotas(
    prestamoId: string,
    montoTotal: number,
    cuotasTotales: number,
    fechaInicio: string
  ): Promise<HistorialPago[]> {
    const montoCuota = montoTotal / cuotasTotales;
    const cuotas: HistorialPago[] = [];
    const fechaInicioObj = new Date(fechaInicio);

    for (let i = 1; i <= cuotasTotales; i++) {
      const fechaPago = new Date(fechaInicioObj);
      fechaPago.setMonth(fechaInicioObj.getMonth() + i);

      const { data, error } = await supabase
        .from('historial_pagos')
        .insert({
          prestamo_id: prestamoId,
          fecha_pago: fechaPago.toISOString().split('T')[0],
          monto_pagado: parseFloat(montoCuota.toFixed(2)),
          cuota_numero: i,
          metodo_pago: 'Pendiente',
          estado: 'Pendiente',
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creando cuota ${i}:`, error);
        continue; // Continuar con las siguientes cuotas
      }

      if (data) cuotas.push(data);
    }

    return cuotas;
  }

  async update(id: string, prestamo: Partial<Prestamo>): Promise<Prestamo> {
    const { data, error } = await supabase
      .from(this.table)
      .update(prestamo)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }
}
