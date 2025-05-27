import { Component, OnInit } from '@angular/core';
import { SociosService } from '../../services/socios.service';
import { UsuariosService } from '../../services/usuarios.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Socio } from '../../interfaces/Socio';
import { Usuario } from '../../interfaces/Usuario';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-socios-list',
  imports: [NgFor, NgIf, DatePipe, FormsModule],
  templateUrl: './socios-list.component.html',
  styleUrl: './socios-list.component.css',
})
export class SociosListComponent implements OnInit {
  socios: Socio[] = [];
  usuarios: Usuario[] = [];
  loading = true;
  displayDialog = false;
  socioSeleccionado: any = {};
  terminoBusqueda = '';

  constructor(
    private sociosService: SociosService,
    private usuariosService: UsuariosService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.sociosService.socios$.subscribe((data) => {
      this.socios = data;
    });

    this.usuariosService.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios.filter(
        (u) => u.roles?.nombre === 'socio' || !u.rol_id
      );
    });

    this.cargarDatosIniciales();
  }

  async cargarDatosIniciales(): Promise<void> {
    this.loading = true;
    try {
      await this.sociosService.cargarSocios(); // Actualiza el observable
      await this.usuariosService.cargarUsuarios(); // Actualiza el observable
    } catch (error) {
      this.mostrarError('Error al cargar datos iniciales');
    } finally {
      this.loading = false;
    }
  }

  async buscarSocios() {
    if (!this.terminoBusqueda) {
      await this.cargarDatosIniciales();
      return;
    }

    this.loading = true;
    try {
      this.socios = await this.sociosService.buscarSocios(this.terminoBusqueda);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.mostrarError('Error al buscar socios');
    }
  }

  mostrarDialogoEditar(socio?: any) {
    this.socioSeleccionado = socio
      ? {
          id: socio.id,
          usuario_id: socio.usuario?.id || socio.usuario_id, // ← esto debe ser un string
          lugar_trabajo: socio.lugar_trabajo,
          telefono_trabajo: socio.telefono_trabajo,
        }
      : {
          usuario_id: null,
          lugar_trabajo: '',
          telefono_trabajo: '',
        };

    // Confirma en consola que usuario_id es un string UUID
    console.log('Editando socio:', this.socioSeleccionado);
    this.displayDialog = true;
  }

  async guardarSocio() {
    const yaExiste = this.socios.some(
      (s) =>
        s.usuario_id ===
        (this.socioSeleccionado.usuario_id?.id ||
          this.socioSeleccionado.usuario_id)
    );

    if (!this.socioSeleccionado.id && yaExiste) {
      this.mostrarError('Este usuario ya está registrado como socio.');
      alert('Este usuario ya está registrado como socio.');
      return;
    }

    try {
      await this.sociosService.guardarSocio(this.socioSeleccionado);
      this.mostrarExito('Socio guardado correctamente');
      this.displayDialog = false;
    } catch (error) {
      this.mostrarError('Error al guardar socio');
    }
  }

  confirmarEliminar(socio: any) {
    const nombre = socio.usuario?.nombre || '';
    const apellido = socio.usuario?.apellido || '';

    const mensaje = `¿Estás seguro de eliminar al socio ${nombre} ${apellido}?`;

    const confirmado = window.confirm(mensaje);

    if (confirmado) {
      this.sociosService
        .eliminarSocio(socio.id)
        .then(() => {
          this.mostrarExito('Socio eliminado correctamente');
        })
        .catch(() => {
          this.mostrarError('Error al eliminar socio');
        });
    }
  }

  private mostrarExito(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje,
    });
  }

  private mostrarError(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje,
    });
  }

  //Validaciones
  lugarTrabajoError: string = '';
telefonoTrabajoError: string = '';

// Validación lugar de trabajo
validarLugarTrabajo() {
  const texto = this.socioSeleccionado.lugar_trabajo?.trim() || '';
  const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

  if (!texto) {
    this.lugarTrabajoError = 'El lugar de trabajo es obligatorio.';
  } else if (!regex.test(texto)) {
    this.lugarTrabajoError = 'Solo se permiten letras y espacios.';
  } else {
    this.lugarTrabajoError = '';
  }
}

// Validación teléfono trabajo
validarTelefonoTrabajo(event: any) {
  let value = event.target.value;

  // Eliminar caracteres no numéricos
  value = value.replace(/\D/g, '');
  if (value.length > 9) {
    value = value.slice(0, 9);
  }

  event.target.value = value;
  this.socioSeleccionado.telefono_trabajo = value;

  // Mostrar error si no tiene 9 dígitos
  this.telefonoTrabajoError =
    value.length === 9 ? '' : 'El número debe tener exactamente 9 dígitos.';
}

}
