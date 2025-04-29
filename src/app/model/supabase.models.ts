// Modelo para usuario
export interface Usuario {
  identificacion?: string; // UUID generado por Supabase
  dni: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono_movil?: string;
  fecha_nacimiento?: string;
  genero?: string;
  ciudad?: string;
  pais?: string;
  fecha_ingreso?: string;
  rol_id?: string;
  creado_en?: string;
}

// Modelo para socio
export interface Socio {
  identificacion?: string; // UUID generado por Supabase
  socio_id: string | SocioCompleto;
  lugar_trabajo?: string;
  telefono_trabajo?: string;
  creado_en?: string;
  usuario?: Usuario; // Para relaciones anidadas
}

// Modelo para préstamo
export interface Prestamo {
  identificacion?: string; // UUID generado por Supabase
  socio_id: SocioCompleto;
  monto: number;
  cuotas_totales: number;
  cuotas_pagadas?: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado?: string;
  creado_en?: string;
  socio?: Socio; // Para relaciones anidadas
}

// Modelo para pago histórico
export interface PagoHistorico {
  id: string; // UUID generado por Supabase
  prestamo_id: string | PrestamoCompleto;
  fecha_pago: string;
  monto_pagado: number;
  cuota_numero: number;
  método_pago: string;
  creado_en?: string;
  prestamo?: Prestamo; // Para relaciones anidadas
}

// Modelo para rol
export interface Rol {
  id: string; // UUID generado por Supabase
  nombre: string;
  descripcion?: string;
}

// Para respuestas completas con datos anidados
export interface SocioCompleto extends Socio {
  ID_de_usuario: Usuario;
}

export interface PrestamoCompleto extends Prestamo {
  socio_id: SocioCompleto;
}

export interface PagoHistoricoCompleto extends PagoHistorico {
  prestamo_id: PrestamoCompleto;
}
