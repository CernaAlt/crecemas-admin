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

  interes_anual: number; // % anual negociable con cliente
  producto: string; // ejemplo: "Préstamo Libre Disponibilidad"
  tipo_seguro: string; // ejemplo: "Convencional Individual"
  tasa_seguro: number; // ejemplo: 0.069
  tcea: number; // calculado automáticamente en el servicio

  socio?: Socio;
}