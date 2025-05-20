import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { HistorialPago } from '../../../interfaces/historial-pago.model';
import { HistorialPagosService } from '../../../services/historial-pagos.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-historial-pagos-form',
  imports: [ReactiveFormsModule],
  templateUrl: './historial-pagos-form.component.html',
  styleUrl: './historial-pagos-form.component.css'
})
export class HistorialPagosFormComponent implements OnInit {
  @Input() pago: HistorialPago | null = null;
  @Output() formSaved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private historialPagosService: HistorialPagosService
  ) {
    this.form = this.fb.group({
      prestamo_id: ['', Validators.required],
      fecha_pago: ['', Validators.required],
      monto_pagado: [0, [Validators.required, Validators.min(0)]],
      cuota_numero: [1, [Validators.required, Validators.min(1)]],
      metodo_pago: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Cargar datos en el formulario si existe un pago seleccionado
    if (this.pago) {
      this.form.patchValue(this.pago);
    }
  }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['historial_pagos'] && this.pago) {
      this.form.patchValue(this.pago);
    } else {
      this.form.reset();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const pagoData: HistorialPago = this.form.value;

    try {
      if (this.pago?.id) {
        await this.historialPagosService.update(this.pago.id, pagoData);
      } else {
        await this.historialPagosService.create(pagoData);
      }
      this.formSaved.emit();
      this.form.reset();
    } catch (error) {
      console.error('Error al guardar el historial de pago:', error);
    }
  }

  onCancel(): void {
    this.form.reset();
    this.cancel.emit();
  }
}
