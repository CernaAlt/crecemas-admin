// src/app/services/prestamos.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../../supabase/supabase-client';
import { Prestamo } from '../../interfaces/Prestamo';
import { HistorialPago } from '../../interfaces/historial-pago.model';

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

  async create(
    prestamo: Prestamo
  ): Promise<{ prestamo: Prestamo; cuotas: HistorialPago[] }> {
    if (
      !prestamo.socio_id ||
      prestamo.monto <= 0 ||
      prestamo.cuotas_totales <= 0
    ) {
      throw new Error('Datos del préstamo inválidos');
    }

    // Parámetros de entrada
    const monto = prestamo.monto;
    const cuotas = prestamo.cuotas_totales;
    const tasaInteresAnual = prestamo.interes_anual / 100;
    const tasaSeguroAnual = prestamo.tasa_seguro ?? 0.069;

    // Convertir tasas a mensual (capitalización compuesta)
    const tasaMensual = Math.pow(1 + tasaInteresAnual, 1 / 12) - 1;
    const tasaSeguroMensual = tasaSeguroAnual / 100 / 12;

    // Calcular cuota mensual base sin seguro
    const cuotaMensual =
      monto * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -cuotas)));

    // Generar cuotas preliminares con seguro aplicado sobre saldo
    let saldoPendiente = monto;
    const flujos = [];

    for (let i = 0; i < cuotas; i++) {
      const interes = saldoPendiente * tasaMensual;
      const amortizacion = cuotaMensual - interes;
      const seguro = saldoPendiente * tasaSeguroMensual;
      const cuotaConSeguro = cuotaMensual + seguro;

      flujos.push(cuotaConSeguro);
      saldoPendiente -= amortizacion;
    }

    // Calcular TCEA referencial a partir de los flujos
    const flujoInicial = -monto;
    const todosFlujos = [flujoInicial, ...flujos];
    const tirMensual = this.calcularTIR(todosFlujos);
    const tcea = Math.pow(1 + tirMensual, 12) - 1;

    // Setear datos automáticos al préstamo
    prestamo.cuotas_pagadas = 0;
    prestamo.estado = 'Activo';
    prestamo.tcea = parseFloat((tcea * 100).toFixed(6));
    prestamo.fecha_fin = this.calcularFechaFin(prestamo.fecha_inicio, cuotas);

    // Guardar préstamo en Supabase
    const { data, error } = await supabase
      .from(this.table)
      .insert(prestamo)
      .select()
      .single();
    if (error) throw new Error('No se pudo crear el préstamo');

    // Generar cuotas con valores detallados
    const cuotasGeneradas = await this.generarCuotas(
      data.id,
      monto,
      cuotas,
      prestamo.fecha_inicio,
      prestamo.interes_anual,
      tasaSeguroAnual
    );

    return { prestamo: data, cuotas: cuotasGeneradas };
  }

  //Función para calcular TIR (Tasa Interna de Retorno)
  private calcularTIR(flujos: number[], guess = 0.05): number {
    const maxIter = 1000;
    const precision = 1e-6;
    let tasa = guess;

    for (let i = 0; i < maxIter; i++) {
      let f = 0;
      let df = 0;

      for (let t = 0; t < flujos.length; t++) {
        f += flujos[t] / Math.pow(1 + tasa, t);
        df -= (t * flujos[t]) / Math.pow(1 + tasa, t + 1);
      }

      const nuevaTasa = tasa - f / df;
      if (Math.abs(nuevaTasa - tasa) < precision) return nuevaTasa;
      tasa = nuevaTasa;
    }

    throw new Error('No se pudo calcular la TIR');
  }

  //Función para calcular fecha de fin automáticamente
  private calcularFechaFin(fechaInicio: string, cuotas: number): string {
    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + cuotas);
    return fecha.toISOString().split('T')[0];
  }

  // Método para generar las cuotas automáticamente
  private async generarCuotas(
    prestamoId: string,
    montoTotal: number,
    cuotasTotales: number,
    fechaInicio: string,
    interesAnual: number,
    tasaSeguroAnual: number
  ): Promise<HistorialPago[]> {
    const tasaInteresMensual = Math.pow(1 + interesAnual / 100, 1 / 12) - 1;
    const tasaSeguroMensual = tasaSeguroAnual / 100 / 12;

    const cuotaMensual =
      montoTotal *
      (tasaInteresMensual /
        (1 - Math.pow(1 + tasaInteresMensual, -cuotasTotales)));

    let saldoPendiente = montoTotal;
    const cuotas: HistorialPago[] = [];
    const fechaInicioObj = new Date(fechaInicio);

    for (let i = 1; i <= cuotasTotales; i++) {
      const interes = saldoPendiente * tasaInteresMensual;
      const amortizacion = cuotaMensual - interes;
      const comisiones_seguros = saldoPendiente * tasaSeguroMensual; // CORREGIDO
      const subvencion = 0;
      const monto_pagado = cuotaMensual + comisiones_seguros;

      // Calcular la fecha exacta sin modificar la original
      const fechaPago = new Date(fechaInicioObj);
      fechaPago.setMonth(fechaPago.getMonth() + i);

      const { data, error } = await supabase
        .from('historial_pagos')
        .insert({
          prestamo_id: prestamoId,
          fecha_pago: fechaPago.toISOString().split('T')[0],
          monto_pagado: parseFloat(monto_pagado.toFixed(2)),
          cuota_numero: i,
          metodo_pago: 'Pendiente',
          estado: 'Pendiente',
          amortizacion: parseFloat(amortizacion.toFixed(2)),
          interes: parseFloat(interes.toFixed(2)),
          comisiones_seguros: parseFloat(comisiones_seguros.toFixed(2)),
          subvencion: parseFloat(subvencion.toFixed(2)),
          saldo: parseFloat((saldoPendiente - amortizacion).toFixed(2)),
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creando cuota ${i}:`, error);
        continue;
      }

      saldoPendiente -= amortizacion;

      if (data) cuotas.push(data);
    }

    return cuotas;
  }

  // Método para actualizar un préstamo
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

  // Método para eliminar un préstamo
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }

  async getPrestamosDelSocio(authUserId: string): Promise<Prestamo[]> {
    const { data: prestamos, error } = await supabase
      .from('prestamos')
      .select(
        `
      *,
      socio: socio_id (
        id,
        usuario: usuario_id (
          id,
          auth_user_id
        )
      )
    `
      )
      .eq('socio.usuario.auth_user_id', authUserId);

    if (error) throw error;

    // Filtramos explícitamente por si algún préstamo no trajo relación por alguna inconsistencia
    const prestamosFiltrados = prestamos.filter(
      (p) => p.socio?.usuario?.auth_user_id === authUserId
    );

    return prestamosFiltrados;
  }

  //
  async getHistorialPagosPorPrestamo(
    prestamoId: string
  ): Promise<HistorialPago[]> {
    const { data, error } = await supabase
      .from('historial_pagos')
      .select('*')
      .eq('prestamo_id', prestamoId)
      .order('cuota_numero', { ascending: true });

    if (error) throw error;
    return data;
  }

  //Actualizar cuotas Pagadas
  async actualizarCuotasPagadas(
    prestamoId: string,
    cuotasPagadas: number
  ): Promise<void> {
    const { error } = await supabase
      .from('prestamos')
      .update({ cuotas_pagadas: cuotasPagadas })
      .eq('id', prestamoId);

    if (error) throw error;
  }

  //Actualizar estado de la cuota si esta pagada o aun no.
  async actualizarEstadoCuota(
    historialPagoId: string,
    nuevoEstado: string
  ): Promise<void> {
    const { error } = await supabase
      .from('historial_pagos')
      .update({ estado: nuevoEstado })
      .eq('id', historialPagoId);

    if (error) throw error;
  }



}
