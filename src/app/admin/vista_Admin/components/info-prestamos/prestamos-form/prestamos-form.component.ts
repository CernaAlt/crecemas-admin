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
import { SociosService } from '../../../services/socios.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-prestamos-form',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './prestamos-form.component.html',
  styleUrl: './prestamos-form.component.css',
})
export class PrestamosFormComponent {
  @Input() prestamo: Prestamo | null = null;
  @Output() formSaved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  // Aquí puedes definir el tipo de datos según tu modelo
  socios: any[] = [];
  tceaReferencial: number | null = null; // <- NUEVO

  constructor(
    private fb: FormBuilder,
    private service: PrestamosService,
    private sociosService: SociosService
  ) {
    this.form = this.fb.group({
      socio_id: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(50)]],
      cuotas_totales: [0, [Validators.required, Validators.min(2)]],
      interes_anual: [5, [Validators.required, Validators.min(0.1)]],
      tasa_seguro: [
        0.069,
        [Validators.required, Validators.min(0)],
      ],
      fecha_inicio: ['', Validators.required],
      // Nuevos
      producto: ['Préstamo Libre Disponibilidad', Validators.required],
      tipo_seguro: ['Convencional Individual', Validators.required],
    });
  }

  async ngOnInit() {
    await this.sociosService.cargarSocios();
    this.sociosService.socios$.subscribe((socios) => (this.socios = socios));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prestamo'] && this.prestamo) {
      // Si se está editando un préstamo, se pueden cargar también cuotas_pagadas, fecha_fin y estado
      this.form.patchValue(this.prestamo);
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      let response;
      if (this.prestamo && this.prestamo.id) {
        response = await this.service.update(this.prestamo.id, this.form.value);
        this.tceaReferencial = response.tcea ?? null;
      } else {
        const result = await this.service.create(this.form.value);
        this.tceaReferencial = result.prestamo.tcea ?? null;
      }
    } catch (error) {
      console.error('Error al guardar el préstamo:', error);
      if (error instanceof Error) {
        throw new Error(error.message); // lanza el error real que viene de Supabase
      } else {
        throw new Error('Error desconocido al guardar el préstamo');
      }
    }

    this.formSaved.emit();
    this.form.reset();
  }

  // Método para cancelar la operación
  onCancel() {
    this.cancel.emit();
    this.form.reset();
  }
}
