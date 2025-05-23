import { Injectable } from '@angular/core';
import { supabase } from '../supabase/supabase-client';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private rolesMap: Map<string, string> = new Map();

  constructor() {
    // Inicialización de los roles al cargar el servicio
    this.initializeRoles();
  }

  /**
   * ✅ Inicializa los roles cargando los datos desde Supabase y los guarda en un Map.
   */
  private async initializeRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, nombre')
        .order('nombre', { ascending: true });

      if (error) {
        console.error('Error al cargar roles:', error.message);
        throw error;
      }

      data?.forEach((role) => {
        this.rolesMap.set(role.id, role.nombre);
      });

      console.log('Roles inicializados correctamente:', this.rolesMap);
    } catch (err:any) {
      console.error('❌ Error al inicializar los roles:', err.message);
    }
  }

  

  /**
   * ✅ Obtiene todos los roles en un arreglo.
   */
  async getAllRoles() {
    if (this.rolesMap.size === 0) {
      await this.initializeRoles();
    }
    return Array.from(this.rolesMap.entries()).map(([id, nombre]) => ({
      id,
      nombre,
    }));
  }

  /**
   * ✅ Obtiene el nombre del rol dado su ID.
   * @param id - ID del rol.
   * @returns Nombre del rol o 'Desconocido' si no existe.
   */
  getRoleNameById(id: string): string {
    return this.rolesMap.get(id) || 'Desconocido';
  }

  /**
   * ✅ Obtiene el ID del rol dado su nombre.
   * @param name - Nombre del rol.
   * @returns ID del rol o undefined si no existe.
   */
  getRoleIdByName(name: string): string | undefined {
    for (const [id, roleName] of this.rolesMap) {
      if (roleName.toLowerCase() === name.toLowerCase()) {
        return id;
      }
    }
    return undefined;
  }
  
  /**
   * ✅ Obtiene el ID del rol por defecto (cliente).
   * @returns ID del rol cliente.
   */
  async getDefaultRoleId() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id')
        .eq('nombre', 'cliente')
        .single();

      if (error) {
        console.error('❌ Error al obtener el rol por defecto:', error.message);
        throw error;
      }

      return data.id;
    } catch (err: any) {
      console.error('❌ Error al obtener el rol por defecto:', err.message);
    }
  }


  /**
   * ✅ Obtiene un rol por su ID de forma asíncrona.
   * @param roleId - ID del rol.
   * @returns Información del rol.
   */
  async getRoleById(roleId: string) {
    if (!roleId) {
      throw new Error('El ID del rol es requerido');
    }

    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single();

      if (error) {
        console.error('❌ Error al obtener el rol:', error.message);
        throw error;
      }

      return data;
    } catch (err:any) {
      console.error('❌ Error en la petición:', err.message);
    }
  }
}
