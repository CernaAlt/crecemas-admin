import { Injectable } from '@angular/core';
import { supabase } from '../../supabase/supabase-client';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

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
      estado: boolean; // opcional, si es necesario
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
          emailRedirectTo: '#',
        },
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
          estado: userData.estado,
          fecha_ingreso: new Date(),
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
      localStorage.setItem('supabase.auth.token', data.session.access_token);

      // Guardar el refresh token en localStorage
      localStorage.setItem(
        'supabase.auth.refresh_token',
        data.session.refresh_token
      );
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

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (error) {
      console.error('Error al refrescar el token:', error.message);
      return { error: error.message };
    }

    // Actualizar los tokens en localStorage
    if (data.session) {
      localStorage.setItem('supabase.auth.token', data.session.access_token);
      localStorage.setItem(
        'supabase.auth.refresh_token',
        data.session.refresh_token
      );
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
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw authError || new Error('Usuario no autenticado');
      }

      // 2. Obtener datos adicionales de public.usuarios
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select(
          `
    *,
    roles:rol_id (
      nombre
    )
  `
        )
        .eq('auth_user_id', authUser.id)
        .single();

      if (userError) throw userError;

      // 3. Combinar datos
      return {
        user: {
          ...authUser,
          ...(userData || {}), // Si no hay datos en usuarios, devolver objeto vacío
        },
        error: null,
      };
    } catch (error: any) {
      console.error('Error en getCompleteUserData:', error);
      return {
        user: null,
        error: error.message,
      };
    }
  }

  // Método para redirigir según el rol
  async redirectBasedOnRole() {
    try {
      // 1. Obtener usuario autenticado
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error(
          'Error al obtener el usuario:',
          error?.message || 'Usuario no autenticado'
        );
        return this.router.navigate(['/login']);
      }

      // 2. Obtener el rol del usuario
      const { data: userProfile, error: profileError } = await supabase
        .from('usuarios')
        .select('rol_id')
        .eq('auth_user_id', user.id)
        .single();

      if (profileError || !userProfile) {
        console.error(
          'Error al obtener perfil:',
          profileError?.message || 'Perfil no encontrado'
        );
        return this.router.navigate(['/profile']);
      }

      // 3. Redirigir según el rol (valida si el ID existe antes de navegar)
      console.log('Rol del usuario:', userProfile.rol_id);

      if (userProfile.rol_id === '5bd36ddb-25ab-4560-ae97-07a8d983e477') {
        console.log('Redirigiendo al Admin Panel');
        return this.router.navigate(['/admin-panel']);
      }

      if (userProfile.rol_id === 'a5b3425b-207a-4ab6-a5d6-2f06c3801ada') {
        console.log('Redirigiendo al Socio Panel');
        return this.router.navigate(['/socio-panel']);
      }

      console.log('Redirigiendo al perfil');
      return this.router.navigate(['/profile']);
    } catch (err) {
      console.error('Error en redirectBasedOnRole:', err);
      return this.router.navigate(['/login']);
    }
  }

  // Método para obtener el rol actual (útil para guards)
  async getCurrentUserRole(): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userProfile } = await supabase
      .from('usuarios')
      .select('rol_id')
      .eq('auth_user_id', user.id)
      .single();

    return userProfile?.rol_id || null;
  }
}
