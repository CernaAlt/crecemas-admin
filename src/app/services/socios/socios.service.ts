import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../../supabase/supabase-client';
import { Socio } from '../../interfaces/Socio';

@Injectable({
  providedIn: 'root',
})
export class SociosService {
  private sociosSubject = new BehaviorSubject<Socio[]>([]);
  socios$ = this.sociosSubject.asObservable();

  constructor() {}

  // Cargar todos los socios con información del usuario
  async cargarSocios(): Promise<void> {
    const { data, error } = await supabase
      .from('socios')
      .select(
        `
        *,
        usuario:usuario_id (
          nombre,
          apellido,
          dni,
          email,
          telefono_movil,
          estado
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar socios:', error);
      throw error;
    }

    //Filtar socios cuyo usuario este activo (estdo=true)
    const sociosFiltrados = (data || []).filter(
      (socio) => socio.usuario?.estado === true
    );

    this.sociosSubject.next(sociosFiltrados);
  }

  // Obtener un socio por ID
  async obtenerSocioPorId(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('socios')
      .select(
        `
        *,
        usuario:usuario_id (
          nombre,
          apellido,
          dni,
          email,
          telefono_movil
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener socio:', error);
      throw error;
    }

    return data;
  }

  // Crear o actualizar un socio
  async guardarSocio(socioData: any): Promise<any> {
    if (!socioData.id) {
      // Solo si es un nuevo registro
      const { data: existentes, error: fetchError } = await supabase
        .from('socios')
        .select('*')
        .eq('usuario_id', socioData.usuario_id);

      if (fetchError) throw fetchError;
      if (existentes && existentes.length > 0) {
        throw new Error('Este usuario ya está registrado como socio.');
      }
    }

    try {
      let data;

      //
      if (socioData.id) {
        // Actualizar socio existente
        const { data: updatedData, error: updateError } = await supabase
          .from('socios')
          .update(socioData)
          .eq('id', socioData.id)
          .select();

        if (updateError) throw updateError;
        data = updatedData;
      } else {
        // Crear nuevo socio (si no tiene ID)
        const { data: newData, error: insertError } = await supabase
          .from('socios')
          .insert(socioData)
          .select();

        if (insertError) throw insertError;
        data = newData;
      }

      // Actualizar la lista
      await this.cargarSocios();
      return data;
    } catch (error) {
      console.error('Error al guardar socio:', error);
      throw error;
    }
  }

  // Eliminar un socio (recibe el ID del socio)
  async eliminarSocio(id: string): Promise<void> {
    //Consulta supabase para eliminar el socio
    const { error } = await supabase.from('socios').delete().eq('id', id);

    // Si hay un error, lo mostramos en la consola
    if (error) {
      console.error('Error al eliminar socio:', error);
      throw error;
    }

    // Recargar la lista de usuarios después de eliminar
    await this.cargarSocios();
  }

  // Buscar socios por lugar de trabajo o datos del usuario
  async buscarSocios(termino: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('socios')
      .select(
        `
        *,
        usuario:usuario_id (
          nombre,
          apellido,
          dni,
          email,
          telefono_movil
        )
      `
      )
      .or(
        `lugar_trabajo.ilike.%${termino}%,telefono_trabajo.ilike.%${termino}%,usuario_id.nombre.ilike.%${termino}%,usuario_id.apellido.ilike.%${termino}%,usuario_id.dni.eq.${termino}`
      );

    if (error) {
      console.error('Error al buscar socios:', error);
      return [];
    }

    return data || [];
  }

  //Obtener datos del socio autenticado
  async getSocioPorAuthUserId(authUserId: string): Promise<Socio | null> {
    // 1. Buscar usuario por auth_user_id
    const { data: usuario, error: errUsuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (errUsuario) throw errUsuario;
    if (!usuario) return null;

    // 2. Buscar socio por usuario_id
    const { data: socio, error: errSocio } = await supabase
      .from('socios')
      .select('*')
      .eq('usuario_id', usuario.id)
      .single();

    if (errSocio) throw errSocio;

    // 3. Combinar manualmente
    return { ...socio, usuario } as Socio;
  }
}
