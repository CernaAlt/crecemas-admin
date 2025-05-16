import { Injectable } from '@angular/core';
import { supabase } from '../supabase/supabase-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Registro de usuarios
  async signUp(
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
        //opcional
        options: {
          emailRedirectTo: '#'
        }
      });

      if (authError) throw authError;

      // 2. Creación del registro en tabla usuarios
      if (authData.user) {
        const { error: userError } = await supabase
          .from('usuarios')
          .insert({
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
            fecha_ingreso: new Date()
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


  // Login de usuarios
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error en el login:', error.message);
      return { error: error.message };
    }

    // Guardar el token 
    if (data.session) {
      // Guardar el token en localStorage
      localStorage.setItem(
        'supabase.auth.token',
        data.session.access_token
      );

      // Guardar el refresh token en localStorage
      localStorage.setItem('supabase.auth.refresh_token', data.session.refresh_token);
    }

    return { data };
  }

  // Logout de usuarios
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      return { error: error.message };
    }

    // Eliminamos el token del almacenamiento local
    localStorage.removeItem('supabase.auth.token');

    // Eliminamos el refresh token del almacenamiento local
    localStorage.removeItem('supabase.auth.refresh_token');

    return { message: 'Sesión cerrada correctamente' };
  }

  // Obtener usuario actual
  getUser() {
    return supabase.auth.getUser();
  }


  // Refrescar el token
  async refreshSession() {
    const refreshToken = localStorage.getItem('supabase.auth.refresh_token');
    if (!refreshToken) {
      console.warn('No se encontró un refresh token');
      return;
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) {
      console.error('Error al refrescar el token:', error.message);
      return { error: error.message };
    }

    // Actualizar los tokens en localStorage
    if (data.session) {
      localStorage.setItem('supabase.auth.token', data.session.access_token);
      localStorage.setItem('supabase.auth.refresh_token', data.session.refresh_token);
      console.log('Token actualizado exitosamente');
    }

    return { data };
  }


  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async getCompleteUserData() {
    try {
      // 1. Obtener datos básicos de auth.users
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw authError || new Error('Usuario no autenticado');
      }

      // 2. Obtener datos adicionales de public.usuarios
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (userError) throw userError;

      // 3. Combinar datos
      return {
        user: {
          ...authUser,
          ...(userData || {}) // Si no hay datos en usuarios, devolver objeto vacío
        },
        error: null
      };
    } catch (error:any) {
      console.error('Error en getCompleteUserData:', error);
      return {
        user: null,
        error: error.message
      };
    }
  }
}
