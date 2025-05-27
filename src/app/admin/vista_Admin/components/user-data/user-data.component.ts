import { Component, Inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Usuario } from '../../interfaces/Usuario';
import { RolesService } from '../../../../services/roles.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-data',
  imports: [FormsModule, NgIf, NgFor, NgClass],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css',
  providers: [ConfirmationService, MessageService],
})
export class UserDataComponent {
  confirmVisible = false;
  terminoBusqueda = '';
  usuarios: Usuario[] = [];
  loading = true;
  displayDialog: boolean = false;
  usuarioSeleccionado: any = {};
  modoEdicion: boolean = false;

  //Roles
  roles: { id: string; nombre: string }[] = [];

  //Notificacion en pantalla
  notificacion: { mensaje: string; tipo: 'success' | 'error' } | null = null;

  constructor(
    private usuarioService: UsuariosService,
    private rolesService: RolesService,
    @Inject(Router) private router: Router
  ) {}

  mostrarDialogoEditar(usuario?: any) {
    this.usuarioSeleccionado = usuario
      ? { ...usuario }
      : {
          dni: '',
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          confirmPassword: '',
          fecha_nacimiento: '',
          genero: '',
          telefono_movil: '',
          ciudad: '',
          pais: '',
          rol_id: '',
        };
    this.modoEdicion = !!usuario;
    this.displayDialog = true;
  }

  async ngOnInit() {
    await this.cargarUsuarios();
    this.cargarRoles();
  }

  //Cargar roles
  cargarRoles() {
    this.rolesService.getAllRoles().then((data) => {
      this.roles = data;
    });
  }

  async cargarUsuarios() {
    this.loading = true;
    try {
      await this.usuarioService.cargarUsuarios();
      this.usuarioService.usuarios$.subscribe((usuarios) => {
        this.usuarios = usuarios; // ✅ Aquí ya no se asigna a usuarioSeleccionado
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
      this.mostrarError('Error al cargar usuarios');
    }
  }

  private mostrarError(mensaje: string) {
    this.notificacion = { mensaje, tipo: 'error' };
    this.ocultarNotificacionDespuesDeUnTiempo();
  }

  private ocultarNotificacionDespuesDeUnTiempo() {
    setTimeout(() => {
      this.notificacion = null;
    }, 3000);
  }

  async guardarUsuario() {
    const user = this.usuarioSeleccionado;

    if (!user.rol_id) {
      alert('Por favor seleccione un rol');
      return;
    }

    if (!this.validateEmail(user.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    if (!this.modoEdicion && user.password !== user.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      if (this.modoEdicion) {
        // Actualización
        await this.usuarioService.actualizarUsuario(user.auth_user_id, {
          ...user,
          fecha_nacimiento: new Date(user.fecha_nacimiento),
        });
        alert('Usuario actualizado correctamente.');
      } else {
        // Registro nuevo
        const response = await this.usuarioService.crearUsuario(
          user.email,
          user.password,
          {
            dni: user.dni,
            nombre: user.nombre,
            apellido: user.apellido,
            fecha_nacimiento: new Date(user.fecha_nacimiento),
            genero: user.genero,
            telefono_movil: user.telefono_movil,
            ciudad: user.ciudad,
            pais: user.pais,
            rol_id: user.rol_id,
          }
        );

        if (response.error) {
          alert(`Error al registrarse: ${response.error.message}`);
        } else {
          alert('✅ Registro exitoso. Verifica tu correo.');
          window.location.reload();
        }
      }

      this.displayDialog = false;
    } catch (error) {
      console.error('Error al guardar usuario', error);
      alert('Ocurrió un error al guardar el usuario.');
    }
  }

  //Buscar usuarios
  async buscarUsuarios() {
    if (!this.terminoBusqueda) {
      await this.cargarUsuarios();
      return;
    }

    this.loading = true;
    try {
      this.usuarios = await this.usuarioService.buscarUsuarios(
        this.terminoBusqueda
      );
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.mostrarError('Error al buscar usuarios');
    }
  }

  // Confirmar eliminación de usuario
  async confirmarEliminar(usuario: Usuario) {
    try {
      await this.usuarioService.eliminarUsuario(usuario.auth_user_id);
      this.mostrarExito('Usuario eliminado correctamente');
      this.confirmVisible = false;
      await this.cargarUsuarios();
    } catch (error) {
      this.mostrarError('Error al eliminar usuario');
      this.confirmVisible = false;
    }
  }

  private mostrarExito(mensaje: string) {
    this.notificacion = { mensaje, tipo: 'success' };
    this.ocultarNotificacionDespuesDeUnTiempo();
  }

  cerrarDialogo() {
    this.displayDialog = false;
  }

  //Validaciones
  emailError: string = '';

  // Validacion del email
  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  validarEmail() {
    const email = this.usuarioSeleccionado.email;
    if (!this.validateEmail(email)) {
      this.emailError = 'Ingresa un correo electrónico válido.';
    } else {
      this.emailError = '';
    }
  }

  passwordError: string = '';

  private validarPassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  }

  verificarContrasenas() {
    const password = this.usuarioSeleccionado.password;
    const confirmPassword = this.usuarioSeleccionado.confirmPassword;

    if (!this.validarPassword(password)) {
      this.passwordError =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
    } else if (password !== confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden.';
    } else {
      this.passwordError = '';
    }
  }

  //Validaciones
  fechaMaxima: string = '';

  tipoDocumento: 'dni' | 'pasaporte' = 'dni';
  dniError: string = '';

  validarDni() {
    const valor = this.usuarioSeleccionado.dni || '';
    if (this.tipoDocumento === 'dni') {
      const dniRegex = /^\d{8}$/;
      this.dniError = dniRegex.test(valor)
        ? ''
        : 'El DNI debe tener exactamente 8 dígitos numéricos.';
    } else {
      const pasaporteRegex = /^[A-Za-z0-9]{6,12}$/;
      this.dniError = pasaporteRegex.test(valor)
        ? ''
        : 'El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos.';
    }
  }

  restringirEntrada(event: KeyboardEvent) {
    if (this.tipoDocumento === 'dni') {
      const tecla = event.key;
      if (!/^\d$/.test(tecla)) {
        event.preventDefault();
      }
    }
  }

  //validacion Telefono movil
  telefonoError: string = '';

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
    this.usuarioSeleccionado.telefono_movil = value;

    // Validar si tiene 9 dígitos exactos
    this.telefonoError =
      value.length === 9 ? '' : 'El número debe tener exactamente 9 dígitos.';
  }

  // Fecha Maxima permitida
  getFechaMaximaPermitida(): string {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split('T')[0]; // yyyy-MM-dd
  }

  nombreError: string = '';
  apellidoError: string = '';

  private validarNombreApellido(texto: string): boolean {
    const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    return texto.trim() !== '' && regex.test(texto.trim());
  }

  validarNombre() {
    if (!this.validarNombreApellido(this.usuarioSeleccionado.nombre)) {
      this.nombreError =
        'El nombre no puede estar vacío ni contener números o símbolos.';
    } else {
      this.nombreError = '';
    }
  }

  validarApellido() {
    if (!this.validarNombreApellido(this.usuarioSeleccionado.apellido)) {
      this.apellidoError =
        'El apellido no puede estar vacío ni contener números o símbolos.';
    } else {
      this.apellidoError = '';
    }
  }

  restringirSoloLetras(event: KeyboardEvent) {
    const tecla = event.key;
    const letrasPermitidas = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]$/;

    if (!letrasPermitidas.test(tecla)) {
      event.preventDefault();
    }
  }

  fechaNacimientoError: string = '';

  validarFechaNacimiento() {
    const fechaNacimiento = new Date(this.usuarioSeleccionado.fecha_nacimiento);
    const hoy = new Date();

    // El usuario debe tener al menos 18 años
    const edadMinima = new Date();
    edadMinima.setFullYear(edadMinima.getFullYear() - 18);

    if (fechaNacimiento > hoy) {
      this.fechaNacimientoError =
        'La fecha de nacimiento no puede ser en el futuro.';
    } else if (fechaNacimiento > edadMinima) {
      this.fechaNacimientoError =
        'Debes tener al menos 18 años para registrarte.';
    } else {
      this.fechaNacimientoError = '';
    }
  }
}
