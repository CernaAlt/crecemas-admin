import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register-user',
  imports: [FormsModule, NgIf],
  standalone: true,
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
})
export class RegisterUserComponent {
  // Para almacenar los roles disponibles
  roles: any[] = [];
  //Manejar el estado de carga de los roles
  isLoadingRoles: boolean = true;

  // Datos de autenticación
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  // Datos del usuario
  dni: string = '';
  nombre: string = '';
  apellido: string = '';
  fecha_nacimiento: string = '';
  genero: string = 'masculino';
  telefono_movil: string = '';
  ciudad: string = '';
  pais: string = 'Perú';
  rol_id: string = '4e8a1ec5-708a-4a91-8431-bfe98844edcb';
  estado: boolean = true; // Deberías obtener esto de tu tabla roles

  //Validaciones
  fechaMaxima: string = '';

  //Validar el DNI O pasaporte
  tipoDocumento: 'dni' | 'pasaporte' = 'dni';
  dniError: string = '';

  constructor(
    private authService: AuthService,
    @Inject(Router) private router: Router
  ) {
    this.fechaMaxima = this.getFechaMaximaPermitida();
  }

  async register() {
    //Validar dni
    this.validarDni();
    if (this.dniError) {
      alert(this.dniError);
      return;
    }

    // Validar nombre
    if (!this.validarNombreApellido(this.nombre)) {
      alert('El nombre solo debe contener letras y espacios.');
      return;
    }

    // Validar apellido
    if (!this.validarNombreApellido(this.apellido)) {
      alert('El apellido solo debe contener letras y espacios.');
      return;
    }

    // Validar teléfono móvil
    if (!/^\d{9}$/.test(this.telefono_movil)) {
      alert('El teléfono móvil debe tener exactamente 9 dígitos numéricos.');
      return;
    }

    // Validación de seguridad de contraseña
    if (!this.validarPassword(this.password)) {
      alert(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
      );
      return;
    }

    // Verificar si rol_id está definido
    if (!this.rol_id) {
      alert('Por favor seleccione un rol');
      return;
    }

    // Validacion de email
    if (!this.validateEmail(this.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    // Validaciones básicas
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const response = await this.authService.signUp(this.email, this.password, {
      dni: this.dni,
      nombre: this.nombre,
      apellido: this.apellido,
      fecha_nacimiento: new Date(this.fecha_nacimiento),
      genero: this.genero,
      telefono_movil: this.telefono_movil,
      ciudad: this.ciudad,
      pais: this.pais,
      rol_id: this.rol_id,
      estado: this.estado, // opcional, si es necesario
    });

    // Manejar la respuesta del registro
    if (response.error) {
      // Mostrar un mensaje de error consola
      console.error('Error al registrarse' + response.error);

      // Mostrar un mensaje de error en la interfaz de usuario
      alert(`Error al registrarse: ${response.error}`);
    } else {
      alert('Registro exitoso. Verifica tu correo.');

      // Mostrar un mensaje de registro exitoso en la consola
      console.log('✅ Usuario registrado exitosamente:', response.data);

      // Redirección al login después de 2 segundos
      alert('Redireccionando al login...');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  }

  // Validacion del email
  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validación de la contraseña
  private validarPassword(password: string): boolean {
    // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  }

  //Validacion de DNI
  validarDni() {
    if (this.tipoDocumento === 'dni') {
      const dniRegex = /^\d{8}$/;
      this.dniError = dniRegex.test(this.dni)
        ? ''
        : 'El DNI debe tener exactamente 8 dígitos numéricos.';
    } else {
      const pasaporteRegex = /^[A-Za-z0-9]{6,12}$/;
      this.dniError = pasaporteRegex.test(this.dni)
        ? ''
        : 'El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos.';
    }
  }

  restringirEntrada(event: KeyboardEvent) {
    if (this.tipoDocumento === 'dni') {
      const tecla = event.key;
      // Solo permitir números
      if (!/^\d$/.test(tecla)) {
        event.preventDefault();
      }
    }
  }

  //validacion Telefono movil
  onTelefonoInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Permitir solo números
    value = value.replace(/\D/g, '');

    // Limitar a 9 caracteres
    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    input.value = value;
    this.telefono_movil = value;
  }

  // Fecha Maxima permitida
  getFechaMaximaPermitida(): string {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split('T')[0]; // yyyy-MM-dd
  }

  private validarNombreApellido(texto: string): boolean {
    const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    return regex.test(texto.trim());
  }
}
