import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-generador-contratos',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './generador-contratos.component.html',
  styleUrl: './generador-contratos.component.css',
})
export class GeneradorContratosComponent {
  contratoForm: FormGroup;
  contratoGenerado = '';

  constructor(private fb: FormBuilder) {
    this.contratoForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/), // Solo letras y espacios
        ],
      ],
      dni: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{8}$/), // Exactamente 8 dígitos numéricos
        ],
      ],
      nacimiento: [
        '',
        [
          Validators.required,
          this.mayorDeEdadValidator(18), // Al menos 18 años
        ],
      ],
      trabajo: ['', [Validators.required, Validators.maxLength(20)]],
      monto: [
        '',
        [
          Validators.required,
          Validators.min(1), // monto mayor a cero
        ],
      ],
      cuotas: [
        '',
        [Validators.required, Validators.min(1), Validators.max(36)],
      ],
      diaPago: [
        '',
        [Validators.required, Validators.min(1), Validators.max(31)],
      ],
      tasaMora: [
        '',
        [Validators.required, Validators.min(0.1), Validators.max(10)],
      ],
    });
  }

  mayorDeEdadValidator(edadMinima: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = new Date(control.value);
      if (isNaN(fechaNacimiento.getTime())) return null; // No es una fecha válida

      const hoy = new Date();
      const fechaLimite = new Date(
        hoy.getFullYear() - edadMinima,
        hoy.getMonth(),
        hoy.getDate()
      );

      return fechaNacimiento <= fechaLimite ? null : { menorDeEdad: true };
    };
  }

  generarContrato() {
    const {
      nombre,
      dni,
      nacimiento,
      trabajo,
      monto,
      cuotas,
      diaPago,
      tasaMora,
    } = this.contratoForm.value;

    this.contratoGenerado = `
CONTRATO DE PRÉSTAMO PERSONAL

Conste por el presente documento el Contrato de Préstamo Personal que celebran de una parte la entidad financiera *CRECEMAS*, en adelante "La Financiera", y de la otra parte el/la Sr./Sra. ${nombre}, identificado(a) con Documento Nacional de Identidad (DNI) N.° ${dni}, nacido(a) el ${nacimiento}, con centro laboral en ${trabajo}, a quien en adelante se le denominará "El Cliente", bajo los términos y condiciones siguientes:

PRIMERO - MONTO DEL PRÉSTAMO:
La Financiera otorga a El Cliente un préstamo por el monto total de **S/ ${monto}** (Nuevos Soles), el cual será destinado para fines personales y/o familiares.

SEGUNDO - FORMA DE PAGO:
El préstamo será amortizado en **${cuotas} cuotas mensuales consecutivas**, que El Cliente se compromete a pagar puntualmente los días **${diaPago} de cada mes**, a partir del mes siguiente a la firma del presente contrato.

TERCERO - INTERESES MORATORIOS:
En caso de incumplimiento en la fecha de pago de alguna cuota, El Cliente incurrirá en mora automática, generándose un interés moratorio del **${tasaMora}% mensual** sobre el saldo vencido, sin necesidad de requerimiento previo por parte de La Financiera.

CUARTO - VIGENCIA Y ACEPTACIÓN:
El presente contrato entra en vigencia a partir de su firma por ambas partes. El Cliente declara haber leído, comprendido y aceptado todos los términos y condiciones establecidos en el presente documento. Asimismo, acepta que el contrato podrá ser respaldado mediante firma digital o electrónica.

En señal de conformidad, ambas partes suscriben el presente contrato.

Lugar y fecha: _______________________________

Firma del Cliente: ____________________________

Firma de la Financiera: _______________________
  `;
  }

  async descargarContratoDoc() {
  if (typeof window === 'undefined') {
    console.warn('La descarga solo puede ejecutarse en el navegador.');
    return;
  }

  const blob = new Blob([this.contratoGenerado], {
    type: 'text/plain;charset=utf-8',
  });

  const { saveAs } = await import('file-saver');
  saveAs(blob, 'ContratoCredito.doc');
}


  /*async descargarContratoPdf() {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    const texto = this.contratoGenerado;

    const lineas = doc.splitTextToSize(texto, 180); // Ajusta el ancho del texto
    doc.setFontSize(12);
    doc.text(lineas, 10, 10); // Posición inicial

    doc.save('ContratoCredito.pdf');
  }*/
}
