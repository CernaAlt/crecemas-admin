import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../supabase/supabase-client';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-user',
  imports: [FormsModule, RouterModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css',
})
export class LoginUserComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  async loginUser() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      if (error) {
        console.error('❌ Error al iniciar sesión:', error.message);
        alert('❌ Error al iniciar sesión: ' + error.message);
        return;
      }

  
      const userId = data.user?.id;

      // 🔎 Consultar estado del usuario
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select('estado')
        .eq('auth_user_id', userId)
        .single();

      if (userError || !usuario) {
        console.error('❌ No se encontró el usuario en la tabla usuarios');
        alert('❌ No se encontró información del usuario');
        // Por seguridad, cerrar sesión
        await supabase.auth.signOut();
        return;
      }

      if (!usuario.estado) {
        alert('⚠️ Tu cuenta está inactiva. Contacta al administrador.');
        await supabase.auth.signOut();
        return;
      }

      // ✅ Usuario activo
      // 🔄 Redirigir según el rol después de un inicio exitoso
      alert('✅ Bienvenido, redirigiendo al Dashboard...');
      await this.authService.redirectBasedOnRole();

      /*setTimeout(() => {
          this.router.navigate(['/profile']); // Ajusta esta ruta a tu componente de Dashboard
        }, 2000);*/
    } catch (err: any) {
      console.error('Error en la petición:', err);
      alert('❌ Error en la petición: ' + err.message);
    }
  }

  // Verificar si ya está autenticado
  async checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      console.log('Usuario ya autenticado. Redirigiendo al Dashboard.');
      await this.authService.redirectBasedOnRole();
    }
  }
}
