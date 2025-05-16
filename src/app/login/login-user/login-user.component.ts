import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../../supabase/supabase-client';

@Component({
  selector: 'app-login-user',
  imports: [FormsModule],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})
export class LoginUserComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  async loginUser() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      if (error) {
        console.error('❌ Error al iniciar sesión:', error.message);
        alert('❌ Error al iniciar sesión: ' + error.message);
      } else {
        console.log('✅ Sesión iniciada correctamente:', data);
        alert('✅ Bienvenido, redirigiendo al Dashboard...');
        
        /*setTimeout(() => {
          this.router.navigate(['/profile']); // Ajusta esta ruta a tu componente de Dashboard
        }, 2000);*/

        // 🔄 Redirigir según el rol después de un inicio exitoso
        await this.authService.redirectBasedOnRole();

      }
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
