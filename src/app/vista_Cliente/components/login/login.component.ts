import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../supabase/auth.service';
import { NgIf } from '@angular/common';
import { supabase } from '../../../supabase/supabase-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  registerForm: FormGroup;
  showRegister = false;
  isLoggedIn = false;
  loginError = '';
  registerError = '';

  errorMessage = '';
  

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isAuthenticated(); // ← esta línea es clave

    this.loginForm = this.fb.group({
      dni: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      dni: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    const { dni, password } = this.loginForm.value;
    const success = await this.authService.login(dni, password);
    if (!success) {
      this.loginError = 'DNI o contraseña incorrectos.';
    } else {
      this.isLoggedIn = true;
      this.loginError = '';
    }
  }

  async onRegister() {
    const { dni, password } = this.registerForm.value;
    const success = await this.authService.register(dni, password);
    if (!success) {
      this.registerError = 'Error al registrar usuario.';
    } else {
      alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      this.toggleForm();
    }
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  toggleForm() {
    this.showRegister = !this.showRegister;
    this.loginError = '';
    this.registerError = '';
  }

  async login(): Promise<void> {
    const { dni, password } = this.loginForm.value;
  
    const success = await this.authService.login(dni, password);
  
    if (success) {
      this.router.navigate(['/admin']); // 🔁 Esto debe redirigir
    } else {
      this.errorMessage = 'DNI o contraseña incorrectos.';
    }
  }

  
}
