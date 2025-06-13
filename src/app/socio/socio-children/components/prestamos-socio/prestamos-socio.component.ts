import { Component, OnInit } from '@angular/core';
import { Prestamo } from '../../../../admin/vista_Admin/interfaces/Prestamo';
import { PrestamosService } from '../../../../services/prestamos/prestamos.service';
import { supabase } from '../../../../supabase/supabase-client';
import { HistorialPago } from '../../../../admin/vista_Admin/interfaces/historial-pago.model';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { SociosService } from '../../../../services/socios/socios.service';
import { Socio } from '../../../../admin/vista_Admin/interfaces/Socio';

@Component({
  selector: 'app-prestamos-socio',
  imports: [NgFor, NgIf, NgClass, DatePipe,CommonModule],
  templateUrl: './prestamos-socio.component.html',
  styleUrl: './prestamos-socio.component.css',
})
export class PrestamosSocioComponent implements OnInit {
  socio: Socio | null = null;
  prestamos: (Prestamo & { historial_pagos: HistorialPago[] })[] = [];
  loading = true;

  constructor(
    private prestamoService: PrestamosService,
    private socioService: SociosService
  ) {}

  async ngOnInit() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const authUserId = user?.id;

    if (!authUserId) return;

    try {
      // 🔎 Obtener socio por auth_user_id
      const socio = await this.socioService.getSocioPorAuthUserId(authUserId);
      if (!socio) return;
      console.log('SOCIO CON USUARIO:', socio);

      this.socio = socio;

      const prestamos = await this.prestamoService.getPrestamosDelSocio(
        authUserId
      );

      const prestamosConPagos = await Promise.all(
        prestamos.map(async (prestamo) => {
          const historial_pagos =
            await this.prestamoService.getHistorialPagosPorPrestamo(
              prestamo.id!
            );
          return { ...prestamo, historial_pagos };
        })
      );

      this.prestamos = prestamosConPagos;
    } catch (error) {
      console.error('Error cargando préstamos del socio:', error);
    } finally {
      this.loading = false;
    }
  }

  //Actualizar las coutas pagadas
  async pagarCuota(
    pagoId: string,
    prestamo: Prestamo & { historial_pagos: HistorialPago[] }
  ) {
    try {
      await this.prestamoService.actualizarEstadoCuota(pagoId, 'pagado');

      // 🔄 Actualizar localmente el estado
      const pago = prestamo.historial_pagos.find((p) => p.id === pagoId);
      if (pago) {
        pago.estado = 'pagado';
      }

      // 🧮 Actualizar contador de cuotas pagadas en el préstamo
      prestamo.cuotas_pagadas += 1;
      await this.prestamoService.actualizarCuotasPagadas(
        prestamo.id!,
        prestamo.cuotas_pagadas
      );
    } catch (error) {
      console.error('Error al pagar cuota:', error);
    }
  }
}
