import { Component, OnInit } from '@angular/core';
import { HistorialPago } from '../../../interfaces/historial-pago.model';
import { HistorialPagosService } from '../../../services/historial-pagos.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-historial-pagos-form',
  imports: [ReactiveFormsModule],
  templateUrl: './historial-pagos-form.component.html',
  styleUrl: './historial-pagos-form.component.css'
})
export class HistorialPagosFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private historialService: HistorialPagosService
  ) {}

  async ngOnInit() {
    this.form = this.fb.group({
      prestamo_id: ['', Validators.required],
      fecha_pago: ['', Validators.required],
      monto_pagado: [0, Validators.required],
      cuota_numero: [0, Validators.required],
      metodo_pago: ['', Validators.required],
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) {
      const pago = await this.historialService.getById(this.id);
      this.form.patchValue(pago!);
      this.isEdit = true;
    }
  }

  async onSubmit() {
    const pago: HistorialPago = this.form.value;

    try {
      if (this.isEdit && this.id) {
        await this.historialService.update(this.id, pago);
      } else {
        await this.historialService.create(pago);
      }
      this.router.navigate(['/historial-pagos']);
    } catch (err) {
      console.error('Error guardando historial de pago', err);
    }
  }
}
