// src/app/services/socio.service.ts

import { Injectable } from '@angular/core';
import { supabase } from '../supabase/supabase-client';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  constructor() {}

  //===== USUARIOS =====//

  // Obtener todos los usuarios
  async getUsuarios() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Obtener un usuario por DNI
  async getUsuarioByDNI(dni: string) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('dni', dni)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener usuario por DNI:', error);
      throw error;
    }
  }

  // Crear un nuevo usuario
  async createUsuario(usuario: {
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
  }) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert(usuario)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Actualizar un usuario existente
  async updateUsuario(dni: string, usuarioData: Partial<{
    nombre: string;
    apellido: string;
    email: string; // Cambiado de correo_electronico a email
    telefono_movil: string;
    fecha_nacimiento: string;
    genero: string;
    ciudad: string;
    pais: string;
    fecha_ingreso: string;
    rol_id: string;
  }>) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update(usuarioData)
        .eq('dni', dni)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  // Eliminar un usuario
  async deleteUsuario(dni: string) {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('dni', dni);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }




  //===== SOCIOS =====//
  
  // Obtener todos los socios con datos de usuario
  async getSocios() {
    try {
      const { data, error } = await supabase
        .from('socios')
        .select(`
          *,
          usuario_id (*)
        `);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener socios:', error);
      throw error;
    }
  }

  // Obtener un socio por ID
  async getSocioById(id: string) {
    try {
      const { data, error } = await supabase
        .from('socios')
        .select(`
          *,
          usuario_id (*)
        `)
        .eq('identificación', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener socio por ID:', error);
      throw error;
    }
  }

  // Crear un nuevo socio
  async createSocio(socio: {
    ID_de_usuario: string;
    lugar_trabajo?: string;
    teléfono_trabajo?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('socios')
        .insert(socio)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear socio:', error);
      throw error;
    }
  }

  // Actualizar un socio existente
  async updateSocio(id: string, socioData: Partial<{
    lugar_trabajo: string;
    teléfono_trabajo: string;
  }>) {
    try {
      const { data, error } = await supabase
        .from('socios')
        .update(socioData)
        .eq('identificación', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar socio:', error);
      throw error;
    }
  }

  // Eliminar un socio
  async deleteSocio(id: string) {
    try {
      const { error } = await supabase
        .from('socios')
        .delete()
        .eq('identificación', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar socio:', error);
      throw error;
    }
  }

  //===== PRESTAMOS =====//
  
  // Obtener todos los préstamos con datos de socio
  async getPrestamos() {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select(`
          *,
          socio_id (
            *,
            ID_de_usuario (*)
          )
        `);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener préstamos:', error);
      throw error;
    }
  }

  // Obtener un préstamo por ID
  async getPrestamoById(id: string) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select(`
          *,
          socio_id (
            *,
            ID_de_usuario (*)
          )
        `)
        .eq('identificación', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener préstamo por ID:', error);
      throw error;
    }
  }

  // Crear un nuevo préstamo
  async createPrestamo(prestamo: {
    socio_id: string;
    monto: number;
    cuotas_totales: number;
    cuotas_pagadas?: number;
    fecha_inicio: string;
    fecha_fin?: string;
    estado?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .insert(prestamo)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear préstamo:', error);
      throw error;
    }
  }

  // Actualizar un préstamo existente
  async updatePrestamo(id: string, prestamoData: Partial<{
    monto: number;
    cuotas_totales: number;
    cuotas_pagadas: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
  }>) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .update(prestamoData)
        .eq('identificación', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar préstamo:', error);
      throw error;
    }
  }

  // Eliminar un préstamo
  async deletePrestamo(id: string) {
    try {
      const { error } = await supabase
        .from('prestamos')
        .delete()
        .eq('identificación', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar préstamo:', error);
      throw error;
    }
  }


  //===== PAGOS HISTÓRICOS =====//
  
  // Obtener todos los pagos históricos
  async getPagosHistoricos() {
    try {
      const { data, error } = await supabase
        .from('pagos_históricos')
        .select(`
          *,
          prestamo_id (
            *,
            socio_id (
              *,
              ID_de_usuario (*)
            )
          )
        `);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener pagos históricos:', error);
      throw error;
    }
  }

  // Obtener pagos históricos por ID de préstamo
  async getPagosHistoricosByPrestamo(prestamoId: string) {
    try {
      const { data, error } = await supabase
        .from('pagos_históricos')
        .select('*')
        .eq('prestamo_id', prestamoId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener pagos históricos por préstamo:', error);
      throw error;
    }
  }

  // Crear un nuevo pago histórico
  async createPagoHistorico(pago: {
    prestamo_id: string;
    fecha_pago: string;
    monto_pagado: number;
    cuota_numero: number;
    método_pago: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('pagos_históricos')
        .insert(pago)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear pago histórico:', error);
      throw error;
    }
  }

  // Actualizar un pago histórico existente
  async updatePagoHistorico(id: string, pagoData: Partial<{
    fecha_pago: string;
    monto_pagado: number;
    cuota_numero: number;
    método_pago: string;
  }>) {
    try {
      const { data, error } = await supabase
        .from('pagos_históricos')
        .update(pagoData)
        .eq('identificación', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar pago histórico:', error);
      throw error;
    }
  }

  // Eliminar un pago histórico
  async deletePagoHistorico(id: string) {
    try {
      const { error } = await supabase
        .from('pagos_históricos')
        .delete()
        .eq('identificación', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar pago histórico:', error);
      throw error;
    }
  }

  //===== ROLES =====//
  
  // Obtener todos los roles
  async getRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  }
}
