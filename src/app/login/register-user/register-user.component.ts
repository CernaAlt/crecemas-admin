import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RolesService } from '../../services/roles.service';
import { NgFor, NgIf } from '@angular/common';
import { Router} from '@angular/router';

@Component({
  selector: 'app-register-user',
  imports: [FormsModule, NgFor, NgIf],
  standalone: true,
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
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
  rol_id: string = ''; // Deberías obtener esto de tu tabla roles

  constructor(
    private authService: AuthService,
    private rolesService: RolesService,
    @Inject(Router) private router: Router
  ) {
    this.loadRoles();
  }

  // Cargar roles al inicializar el componente
  async loadRoles() {
    this.isLoadingRoles = true;
    
    try {
      // Obtener todos los roles
      this.roles = await this.rolesService.getAllRoles();
      
      // Obtener el ID del rol por defecto (cliente)
      const defaultRoleId = await this.rolesService.getDefaultRoleId();
      
      // Asignar el rol por defecto
      this.rol_id = defaultRoleId;
      
    } catch (error) {
      console.error('Error al cargar roles:', error);
      alert('Error al cargar los roles disponibles');
    } finally{
      this.isLoadingRoles = false;
    }
  }


  async register() {
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

    const response = await this.authService.signUp(
      this.email,
      this.password,
      {
        dni: this.dni,
        nombre: this.nombre,
        apellido: this.apellido,
        fecha_nacimiento: new Date(this.fecha_nacimiento),
        genero: this.genero,
        telefono_movil: this.telefono_movil,
        ciudad: this.ciudad,
        pais: this.pais,
        rol_id: this.rol_id
      }
    );

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
      alert('Redireccionando al login...')
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

}
