import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../supabase/supabase-client';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-reservas-clientes',
  imports: [ReactiveFormsModule, NgClass,NgIf, NgFor],
  templateUrl: './reservas-clientes.component.html',
  styleUrl: './reservas-clientes.component.css'
})
export class ReservasClientesComponent implements OnInit {


  reservationForm!: FormGroup;

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  cooldownError = false;

  reasonTypes = [
    'Préstamo Personal',
    'Préstamo Hipotecario',
    'Préstamo Vehicular',
    'Tarjeta de Crédito',
    'Refinanciamiento',
    'Consulta General'
  ];

  private supabase: SupabaseClient;


  constructor(private fb: FormBuilder) {
    this.supabase = supabase;
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.reservationForm = this.fb.group({
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      typeReason: ['', Validators.required],
      detailReason: ['', Validators.required],
      DNI: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      Phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
    });
  }

  // Getters para facilitar la validación en la plantilla
  get f() { return this.reservationForm.controls; }

  async onSubmit() {
    // Marca todos los campos como tocados para activar validaciones
    Object.keys(this.reservationForm.controls).forEach(key => {
      const control = this.reservationForm.get(key);
      control?.markAsTouched();
    });
  
    if (this.reservationForm.invalid) {
      return;
    }
  
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = '';
    this.cooldownError = false;
  
    try {

      const dni = this.reservationForm.value.DNI;

      // 1. Verificar si el usuario ya tiene una solicitud en las últimas 4 horas
      const fourHoursAgo = new Date();
      fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);
  
  
      const { data: recentReservations, error: queryError } = await this.supabase
        .from('ReservasCreditos')
        .select('created_at')
        .eq('DNI', dni)
        .gte('created_at', fourHoursAgo.toISOString()
      );

      if (queryError) {
          throw new Error('Error al verificar reservas recientes');
      }

      // Si encontramos reservas recientes, no permitir una nueva
      if (recentReservations && recentReservations.length > 0) {
        this.cooldownError = true;
        this.isSubmitting = false;
        return;
      }

  
      // 2. Si pasa la validación, proceder con la inserción
      const reservationData = {
        lastName: this.reservationForm.value.LastName,
        typeReason: this.reservationForm.value.typeReason,
        detailReason: this.reservationForm.value.detailReason,
        DNI: this.reservationForm.value.DNI,
        phone: this.reservationForm.value.Phone,
        atendido: false // Nuevo campo para marcar si ha sido atendido
      };
  
      // Insertar en Supabase
      const { data, error } = await this.supabase
        .from('ReservasCreditos')
        .insert([reservationData]);

      if (error) {
        throw new Error(error.message);
      }

      // Si la inserción es exitosa, mostrar mensaje de éxito
      this.submitSuccess = true;
      // Limpiar el formulario
      this.resetForm();

      
    } catch (error: any) {
      this.submitError = error.message || 'Ocurrió un error al enviar la solicitud.';
    } finally {
      this.isSubmitting = false;
    }
  }
  

  resetForm() {
    this.createForm();
    this.reservationForm.markAsPristine();
    this.reservationForm.markAsUntouched();
  }

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    // Permite solo números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
  preventPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(clipboardData)) {
      event.preventDefault();
    }
  }
  
}
