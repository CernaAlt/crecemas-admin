import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrestamosService } from '../../../services/prestamos.service';
import { Prestamo } from '../../../interfaces/Prestamo';

@Component({
  selector: 'app-prestamos-form',
  imports: [ReactiveFormsModule],
  templateUrl: './prestamos-form.component.html',
  styleUrl: './prestamos-form.component.css',
})
export class PrestamosFormComponent {
  @Input() prestamo: Prestamo | null = null;
  @Output() formSaved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private service: PrestamosService) {
    this.form = this.fb.group({
      socio_id: ['', [Validators.required]], // ✔ Validadores síncronos en un array
      monto: [0, [Validators.required, Validators.min(50)]], // ✔ Correcto
      cuotas_totales: [0, [Validators.required, Validators.min(2)]], // ✔
      cuotas_pagadas: [0, [Validators.required, Validators.min(0)]], // ✔
      fecha_inicio: ['', [Validators.required]], // ✔
      fecha_fin: ['', [Validators.required]], // ✔
      estado: ['', [Validators.required]], // ✔
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prestamo'] && this.prestamo) {
      this.form.patchValue(this.prestamo);
    }
  }

  async onSubmit() {
    // Validar el formulario
    // Si el formulario es inválido, marcar todos los campos como tocados
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Si el formulario es válido, proceder a guardar los datos
    // Aquí puedes realizar la lógica para guardar los datos
    try {
      // Si hay un préstamo existente, actualizarlo; de lo contrario, crear uno nuevo
      if (this.prestamo && this.prestamo.id) {
        await this.service.update(this.prestamo.id, this.form.value);
      } else {
        await this.service.create(this.form.value);
      }
    } catch (error) {
      console.error('Error al guardar el préstamo:', error);
    }

    // Emitir el evento de guardado y resetear el formulario
    this.formSaved.emit();
    this.form.reset();
  }

  // Método para cancelar la operación
  onCancel() {
    this.cancel.emit();
    this.form.reset();
  }
}
