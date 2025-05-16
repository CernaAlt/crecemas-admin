import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-user-data',
  imports: [FormsModule,TableModule,DialogModule, ToastModule,DropdownModule, ConfirmDialogModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css',
  providers: [ConfirmationService, MessageService]
  
})
export class UserDataComponent {
  usuarios: any[] = [];
  loading = true;
  displayDialog = false;
  usuarioSeleccionado: any = {};
  terminoBusqueda = '';

  constructor(
    private usuariosService: UsuariosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.loading = true;
    try {
      await this.usuariosService.cargarUsuarios();
      this.usuariosService.usuarios$.subscribe(usuarios => {
        this.usuarios = usuarios;
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
      this.mostrarError('Error al cargar usuarios');
    }
  }

  async buscarUsuarios() {
    if (!this.terminoBusqueda) {
      await this.cargarUsuarios();
      return;
    }

    this.loading = true;
    try {
      this.usuarios = await this.usuariosService.buscarUsuarios(this.terminoBusqueda);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.mostrarError('Error al buscar usuarios');
    }
  }

  mostrarDialogoEditar(usuario?: any) {
    this.usuarioSeleccionado = usuario ? { ...usuario } : {};
    this.displayDialog = true;
  }

  async guardarUsuario() {
    try {
      if (this.usuarioSeleccionado.auth_user_id) {
        // Actualizar
        await this.usuariosService.actualizarUsuario(
          this.usuarioSeleccionado.auth_user_id, 
          this.usuarioSeleccionado
        );
        this.mostrarExito('Usuario actualizado correctamente');
      }
      this.displayDialog = false;
    } catch (error) {
      this.mostrarError('Error al guardar usuario');
    }
  }

  confirmarEliminar(usuario: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this.usuariosService.eliminarUsuario(usuario.auth_user_id);
          this.mostrarExito('Usuario eliminado correctamente');
        } catch (error) {
          this.mostrarError('Error al eliminar usuario');
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
