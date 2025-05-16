import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../../../supabase/supabase-client';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private usuariosSubject = new BehaviorSubject<any[]>([]);
  usuarios$ = this.usuariosSubject.asObservable();

  constructor() {}

  // Cargar todos los usuarios
  async cargarUsuarios(): Promise<void> {
    const { data, error } = await supabase
      .from('usuarios')
      .select(
        `
        *,
        roles:rol_id (nombre)
      `
      )
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }

    this.usuariosSubject.next(data || []);
  }

  // Obtener un usuario por ID
  async obtenerUsuarioPorId(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('usuarios')
      .select(
        `
        *,
        roles:rol_id (nombre)
      `
      )
      .eq('auth_user_id', id)
      .single();

    if (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }

    return data;
  }

  // Actualizar un usuario
  async actualizarUsuario(id: string, datosActualizados: any): Promise<any> {
    const { data, error } = await supabase
      .from('usuarios')
      .update(datosActualizados)
      .eq('auth_user_id', id)
      .select();

    if (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }

    // Actualizar la lista de usuarios
    await this.cargarUsuarios();
    return data;
  }

  // Eliminar un usuario (soft delete)
  async eliminarUsuario(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .update({ activo: false, fecha_eliminacion: new Date() })
      .eq('auth_user_id', id);

    if (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }

    // Actualizar la lista de usuarios
    await this.cargarUsuarios();
  }

  // Buscar usuarios por nombre, email o DNI
  async buscarUsuarios(termino: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select(
        `
        *,
        roles:rol_id (nombre)
      `
      )
      .or(
        `nombre.ilike.%${termino}%,apellido.ilike.%${termino}%,email.ilike.%${termino}%,dni.eq.${termino}`
      );

    if (error) {
      console.error('Error al buscar usuarios:', error);
      return [];
    }

    return data || [];
  }
}
