import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';
import { supabase } from '../../supabase/supabase-client';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
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
      .eq('estado', true)
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }

    this.usuariosSubject.next((data || []) as Usuario[]);
  }

  // Obtener un usuario por ID
  async obtenerUsuarioPorId(id: string): Promise<Usuario | null> {
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

    return data as Usuario;
  }

  
  async crearUsuario(
    email: string,
    password: string,
    userData: {
      dni: string;
      nombre: string;
      apellido: string;
      fecha_nacimiento: Date;
      genero: string;
      telefono_movil: string;
      ciudad: string;
      pais: string;
      rol_id: string;
    }
  ) {
    try {
      // 1. Verificar si el DNI ya existe
      const dniExists = await this.checkDniExists(userData.dni);
      if (dniExists) {
        throw new Error('El DNI ya está registrado');
      }

      // 2. Registro en auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Creación del registro en tabla usuarios
      if (authData.user) {
        const { error: userError } = await supabase.from('usuarios').insert({
          auth_user_id: authData.user.id,
          email: email, // ¡Asegúrate de incluir el email aquí!
          dni: userData.dni,
          nombre: userData.nombre,
          apellido: userData.apellido,
          fecha_nacimiento: userData.fecha_nacimiento,
          genero: userData.genero,
          telefono_movil: userData.telefono_movil,
          ciudad: userData.ciudad,
          pais: userData.pais,
          rol_id: userData.rol_id,
          fecha_ingreso: new Date(),
          estado: true,
        });

        if (userError) throw userError;
      }

      return { data: authData };
    } catch (error: any) {
      console.error('Error en el registro:', error);
      return { error: error.message };
    }
  }

  // Validar si un DNI ya existe en la base de datos
  async checkDniExists(dni: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('dni')
      .eq('dni', dni)
      .single();

    return !!data;
  }

  // Actualizar un usuario
  async actualizarUsuario(
    id: string,
    datosActualizados: Partial<Usuario>
  ): Promise<Usuario> {

    const datosLimpios = Object.fromEntries(
      Object.entries(datosActualizados).filter(
        ([clave, valor]) => valor != null && clave !== 'roles' // 👈 ignorar campo virtual
      )
    );

    const { data, error } = await supabase
      .from('usuarios')
      .update(datosLimpios)
      .eq('auth_user_id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }

    const usuariosActuales = this.usuariosSubject.value;
    const indice = usuariosActuales.findIndex((u) => u.auth_user_id === id);
    if (indice !== -1) {
      usuariosActuales[indice] = {
        ...usuariosActuales[indice],
        ...data,
      } as Usuario;
      this.usuariosSubject.next([...usuariosActuales]);
    }

    return data as Usuario;
  }

  async eliminarUsuario(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .update({
        estado: false, // marcar como inactivo
      })
      .eq('auth_user_id', id);

    if (error) {
      console.error('Error al marcar usuario como inactivo:', error);
      throw error;
    }

    const usuariosActuales = this.usuariosSubject.value.filter(
      (u) => u.auth_user_id !== id
    );
    this.usuariosSubject.next(usuariosActuales);
  }

  // Buscar usuarios por nombre, email o DNI
  async buscarUsuarios(termino: string): Promise<Usuario[]> {
    const { data, error } = await supabase.from('usuarios').select(`
        *,
        roles:rol_id (nombre)
      `).or(`
        nombre.ilike.%${termino}%,
        apellido.ilike.%${termino}%,
        email.ilike.%${termino}%,
        dni.eq.${termino}
      `);

    if (error) {
      console.error('Error al buscar usuarios:', error);
      return [];
    }

    return data as Usuario[];
  }
}
