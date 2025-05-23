import { Socio } from "./Socio";

export interface Prestamo {
  id?: string;
  socio_id: string;
  monto: number;
  cuotas_totales: number;
  cuotas_pagadas: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  created_at?: string;

  socio?: Socio;
}