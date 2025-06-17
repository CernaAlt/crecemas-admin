import { Prestamo } from "./Prestamo";

export interface HistorialPago {
  id?: string;
  prestamo_id: string;
  fecha_pago: string;   //vencimiento
  monto_pagado: number;  //Cuota
  cuota_numero: number;  //Número de cuota
  metodo_pago: string;
  estado:string;
  
  amortizacion: number;          // Amortización
  interes: number;               // Interés
  comisiones_seguros: number;    // Comisiones + Seguros
  subvencion: number;            // Subvención
  saldo: number;                 // Saldo

  created_at?: string;


  prestamo?: Prestamo; // relación opcional (join con prestamos)
}
