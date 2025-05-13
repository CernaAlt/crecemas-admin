import { Component } from '@angular/core';
import { Rol, Usuario } from '../../../model/supabase.models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocioService } from '../../../services/socio.service';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-usuario',
  imports: [NgIf, ReactiveFormsModule, NgFor],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  rol: Rol[]=[];
  usuarios: Usuario[] = [];
  usuarioForm: FormGroup;
  editMode = false;
  currentDni: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private supabaseService: SocioService, private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Cambiado de DNI a dni
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telefono_movil: ['', [Validators.pattern(/^[0-9]{9}$/)]],
      fecha_nacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      ciudad: ['', [Validators.required, Validators.minLength(3)]],
      pais: ['', [Validators.required, Validators.minLength(3)]],
      rol_id: ['', Validators.required]
    });
  }

 

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadRoles();
  
  }

  async loadUsuarios() {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      this.usuarios = await this.supabaseService.getUsuarios();
      console.log(this.usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.errorMessage =
        'Error al cargar usuarios. Por favor intente de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }

  async loadRoles(){
    this.isLoading=true;
    this.errorMessage=null;

    try {
      this.rol=await this.supabaseService.getRoles();
      console.log(this.rol)
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.errorMessage =
        'Error al cargar usuarios. Por favor intente de nuevo.';

    } finally{
      this.isLoading = false;
    }
  }

  resetForm() {
    this.usuarioForm.reset();
    this.editMode = false;
    this.currentDni = null;
  }

  onSubmit() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const data = this.usuarioForm.value;
    console.log(data);


    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const usuarioData = this.usuarioForm.value;

    if (this.editMode && this.currentDni) {
      // Eliminar el DNI del objeto de actualización
      const { dni, ...updateData } = usuarioData;

      this.supabaseService
        .updateUsuario(this.currentDni, updateData)
        .then(() => {
          this.successMessage = 'Usuario actualizado correctamente';
          this.loadUsuarios();
          this.resetForm();
        })
        .catch((error) => {
          console.error('Error al actualizar usuario:', error);
          this.errorMessage =
            'Error al actualizar usuario. Por favor intente de nuevo.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.supabaseService
        .createUsuario(usuarioData)
        .then(() => {
          this.successMessage = 'Usuario creado correctamente';
          this.loadUsuarios();
          this.resetForm();
        })
        .catch((error) => {
          console.error('Error al crear usuario:', error);
          this.errorMessage =
            'Error al crear usuario. Por favor intente de nuevo.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  editUsuario(usuario: Usuario) {
    this.editMode = true;
    this.currentDni = usuario.dni;

    this.usuarioForm.patchValue({
      dni: usuario.dni, // Cambiado de DNI a dni
      nombre: usuario.nombre,
      apellido: usuario.apellido, // Cambiado de "Apellido" a "apellido"
      email: usuario.email || '', // Cambiado de correo_electronico a email
      telefono_movil: usuario.telefono_movil || '',
      fecha_nacimiento: usuario.fecha_nacimiento || '',
      genero: usuario.genero || '',
      ciudad: usuario.ciudad || '',
      pais: usuario.pais || '',
    });

    // También cambiar la línea para deshabilitar el campo
    this.usuarioForm.get('dni')?.disable(); // Cambiado de DNI a dni
  }

  async deleteUsuario(dni: string) {
    if (!confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      await this.supabaseService.deleteUsuario(dni);
      this.successMessage = 'Usuario eliminado correctamente';
      this.loadUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      this.errorMessage =
        'Error al eliminar usuario. Por favor intente de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }

  //Permite ingresar solo numeros
  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    // Permite solo números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  //no permite ingresar simbolos
  preventPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(clipboardData)) {
      event.preventDefault();
    }
  }

}
