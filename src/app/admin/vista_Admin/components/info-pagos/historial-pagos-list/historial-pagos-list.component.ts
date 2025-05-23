import { Component, Input, OnInit } from '@angular/core';
import { HistorialPago } from '../../../interfaces/historial-pago.model';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { Prestamo } from '../../../interfaces/Prestamo';
import { supabase } from '../../../../../supabase/supabase-client';

@Component({
  selector: 'app-historial-pagos-list',
  imports: [NgFor, DatePipe, CommonModule],
  templateUrl: './historial-pagos-list.component.html',
  styleUrl: './historial-pagos-list.component.css',
})
// Este componente muestra el historial de pagos de un préstamo específico. Componente Hijo
export class HistorialPagosListComponent implements OnInit {
  @Input() prestamo: Prestamo | null = null;
  cuotas: HistorialPago[] = [];
  loading = true;
  errorMessage: string | null = null;

  async ngOnInit() {
    // Verifica si prestamo no es null y tiene id
    if (this.prestamo?.id) {
      await this.loadCuotas(this.prestamo.id);
    }
  }

  async loadCuotas(prestamoId: string) {
    this.loading = true;
    this.errorMessage = null;

    try {
      const { data, error } = await supabase
        .from('historial_pagos')
        .select('*')
        .eq('prestamo_id', prestamoId)
        .order('cuota_numero', { ascending: true });

      if (error) throw error;
      this.cuotas = data || [];
    } catch (error) {
      console.error('Error cargando cuotas:', error);
      this.errorMessage = 'Error al cargar las cuotas';
    } finally {
      this.loading = false;
    }
  }

  async pagarCuota(cuota: HistorialPago) {
    this.errorMessage = null;

    try {
      const { error } = await supabase
        .from('historial_pagos')
        .update({
          estado: 'Pagado',
          fecha_pago_real: new Date().toISOString(),
          metodo_pago: 'Efectivo',
        })
        .eq('id', cuota.id);

      if (error) throw error;

      // Actualiza el estado de la cuota en el array local
      await this.loadCuotas(this.prestamo!.id!);
      await this.actualizarPrestamo();
    } catch (error) {
      console.error('Error al pagar cuota:', error);
      this.errorMessage = 'Error al registrar el pago';
    }
  }

  private async actualizarPrestamo() {
    const cuotasPagadas = this.cuotas.filter(
      (c) => c.estado === 'Pagado'
    ).length;

    try {
      const { error } = await supabase
        .from('prestamos')
        .update({ cuotas_pagadas: cuotasPagadas })
        .eq('id', this.prestamo!.id);

      if (error) throw error;
    } catch (error) {
      // No mostramos error al usuario para esta operación secundaria
      console.error('Error al actualizar préstamo:', error);
    }
  }
}
