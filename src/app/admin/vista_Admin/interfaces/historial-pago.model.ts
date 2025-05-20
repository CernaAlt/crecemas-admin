export interface HistorialPago {
  id?: string;
  prestamo_id: string;
  fecha_pago: string;
  monto_pagado: number;
  cuota_numero: number;
  metodo_pago: string;
  created_at?: string;
}
