import { Component } from '@angular/core';
import { SociosService } from '../../services/socios.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-socios-list',
  imports: [TableModule, DialogModule, ConfirmDialogModule, ToastModule, InputTextModule, ButtonModule, DropdownModule, DatePipe,FormsModule],
  templateUrl: './socios-list.component.html',
  styleUrl: './socios-list.component.css',
  providers: [ConfirmationService, MessageService]
})
export class SociosListComponent {
  socios: any[] = [];
  usuarios: any[] = [];
  loading = true;
  displayDialog = false;
  socioSeleccionado: any = {};
  terminoBusqueda = '';

  constructor(
    private sociosService: SociosService,
    private usuariosService: UsuariosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.cargarDatosIniciales();
  }

  async cargarDatosIniciales() {
    this.loading = true;
    try {
      // Cargar socios y usuarios disponibles
      await this.sociosService.cargarSocios();
      this.sociosService.socios$.subscribe(data => {
        this.socios = data;
        this.loading = false;
      });

      // Cargar usuarios para el dropdown
      await this.usuariosService.cargarUsuarios();
      this.usuariosService.usuarios$.subscribe(usuarios => {
        this.usuarios = usuarios.filter(u => u.roles?.nombre === 'socio' || !u.rol_id);
      });
    } catch (error) {
      this.loading = false;
      this.mostrarError('Error al cargar datos iniciales');
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
    this.socioSeleccionado = socio ? { ...socio } : {
      usuario_id: null,
      lugar_trabajo: '',
      telefono_trabajo: ''
    };
    this.displayDialog = true;
  }

  async guardarSocio() {
    try {
      await this.sociosService.guardarSocio(this.socioSeleccionado);
      this.mostrarExito('Socio guardado correctamente');
      this.displayDialog = false;
    } catch (error) {
      this.mostrarError('Error al guardar socio');
    }
  }

  confirmarEliminar(socio: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al socio ${socio.usuario?.nombre || ''} ${socio.usuario?.apellido || ''}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this.sociosService.eliminarSocio(socio.id);
          this.mostrarExito('Socio eliminado correctamente');
        } catch (error) {
          this.mostrarError('Error al eliminar socio');
        }
      }
    });
  }

  private mostrarExito(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje
    });
  }

  private mostrarError(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje
    });
  }

}
