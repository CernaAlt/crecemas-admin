import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

//Importaciones para exportar en excel
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-simulador-creditos',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './simulador-creditos.component.html',
  styleUrl: './simulador-creditos.component.css',
})
export class SimuladorCreditosComponent {
  title = 'Simulador de Calendario de pago de Créditos';

  loanForm!: FormGroup; // Formulario Prestamo
  paymentSchedule: any[] = []; // programacion de pagos
  showResults = false; // mostrar resultados

  // Declaramos un objeto
  totals = {
    installment: 0,
    insurance: 0,
    propertyInsurance: 0,
    interest: 0,
    capital: 0,
    totalPayment: 0,
  };

  // Tipo de moneda
  currencies = [
    { id: 'SOLES', name: 'Soles' },
    { id: 'DOLARES', name: 'Dólares' },
  ];

  // Periodo de pagos
  periodTypes = [
    { id: 'DIARIO', name: 'Diario' },
    { id: 'SEMANAL', name: 'Semanal' },
    { id: 'QUINCENAL', name: 'Quincenal' },
    { id: 'MENSUAL', name: 'Mensual' },
    { id: 'BIMESTRAL', name: 'Bimestral' },
    { id: 'TRIMESTRAL', name: 'Trimestral' },
  ];

  // Productos de prestamos
  loanProducts = [
    { id: 'FACILITO', name: 'Facilito' },
    { id: 'PERSONAL', name: 'Préstamo Personal' },
    { id: 'HIPOTECARIO', name: 'Préstamo Hipotecario' },
    { id: 'VEHICULAR', name: 'Préstamo Vehicular' },
  ];

  // Constructor
  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  //
  createForm() {
    this.loanForm = this.fb.group({
      product: ['FACILITO', Validators.required],
      currency: ['SOLES', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      annualRate: [12, [Validators.required, Validators.min(0.1)]],
      installments: [0, [Validators.required, Validators.min(1)]],
      disbursementDate: [
        new Date().toISOString().substring(0, 10),
        Validators.required,
      ],
      periodType: ['MENSUAL', Validators.required],
      dayOrDate: [, Validators.required],
      fixedPeriod: [false],
      fixedDate: [true],
      gracePeriod: [false],
      gracePeriodMonths: [0],
      propertyInsurance: [false],
      propertyInsuranceRate: [0],
      propertyValue: [1000],
      insuranceOption: ['individual'],
      lifeInsurance: [false],
      lifeInsuranceRate: [0],
    });
  }

  calculateLoan() {
    // Reset results
    this.paymentSchedule = [];
    this.showResults = false;

    const form = this.loanForm.value;

    // Get form values
    const loanAmount = form.amount;
    const annualInterestRate = form.annualRate;
    const numberOfPayments = form.installments;
    const startDate = new Date(form.disbursementDate);
    const fixedDate = form.fixedDate;
    const specificDay = form.dayOrDate;
    const gracePeriod = form.gracePeriod ? form.gracePeriodMonths : 0;

    //Obtención de datos del formulario y conversión correcta de tasas:
    // Calculate monthly interest rate (annual rate / 12 / 100)
    const monthlyInterestRate = annualInterestRate / 12 / 100;

    //Fórmula de amortización para cuotas fijas correctamente aplicada:
    // Calculate fixed payment amount using financial formula for fixed payment loans
    const monthlyPayment =
      (loanAmount *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Generate payment schedule
    let remainingBalance = loanAmount;
    let paymentDate = new Date(startDate);

    // Adjust first payment date based on chosen method
    if (fixedDate) {
      paymentDate.setDate(specificDay);
      // If the specified day is before or equal to the start date, move to next month
      if (paymentDate <= startDate) {
        paymentDate.setMonth(paymentDate.getMonth() + 1);
      }
    } else {
      // For fixed period, add one period to start date
      paymentDate.setMonth(paymentDate.getMonth() + 1);
    }

    // Initialize totals
    this.totals = {
      installment: 0,
      insurance: 0,
      propertyInsurance: 0,
      interest: 0,
      capital: 0,
      totalPayment: 0,
    };

    // Generate each payment in the schedule
    for (let i = 1; i <= numberOfPayments; i++) {
      // Calculate interest for this period
      const interestForPeriod = remainingBalance * monthlyInterestRate;

      // Calculate principal for this period
      const principalForPeriod = monthlyPayment - interestForPeriod;

      // Calculate remaining balance
      let newRemainingBalance = remainingBalance - principalForPeriod;

      // On the last payment, fix any rounding issues
      if (i === numberOfPayments) {
        newRemainingBalance = 0;
      }

      // Format date as DD/MM/YYYY
      const formattedDate = `${paymentDate
        .getDate()
        .toString()
        .padStart(2, '0')}/${(paymentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${paymentDate.getFullYear()}`;

      // Add payment to schedule
      const payment = {
        number: i,
        date: formattedDate,
        installment: Number(monthlyPayment.toFixed(2)),
        interest: Number(interestForPeriod.toFixed(2)),
        principal: Number(principalForPeriod.toFixed(2)),
        balance: Number(newRemainingBalance.toFixed(2)),
        insurance: 0,
        propertyInsurance: 0,
      };

      this.paymentSchedule.push(payment);

      // Update totals
      this.totals.installment += payment.installment;
      this.totals.interest += payment.interest;
      this.totals.capital += payment.principal;
      this.totals.totalPayment += payment.installment;

      // Update remaining balance for next iteration
      remainingBalance = newRemainingBalance;

      // Calculate next payment date
      if (fixedDate) {
        paymentDate.setMonth(paymentDate.getMonth() + 1);

        // Ensure we're using the specified day of the month
        // But handle edge cases like months with fewer days
        const currentMonth = paymentDate.getMonth();
        paymentDate.setDate(specificDay);

        // If setting the specific day moved us to the next month, go back to the last day of intended month
        if (paymentDate.getMonth() !== currentMonth) {
          paymentDate.setDate(0); // Setting to day 0 gives the last day of previous month
        }
      } else {
        // For fixed period, simply add one month
        paymentDate.setMonth(paymentDate.getMonth() + 1);
      }
    }

    // Round totals
    this.totals.installment = Number(this.totals.installment.toFixed(2));
    this.totals.interest = Number(this.totals.interest.toFixed(2));
    this.totals.capital = Number(this.totals.capital.toFixed(2));
    this.totals.totalPayment = Number(this.totals.totalPayment.toFixed(2));

    this.showResults = true;
  }

  exportToPdf() {
    alert('Exportando a PDF...');
    // This would be implemented with a PDF library like jsPDF
  }

  exportToExcel(): void {
    alert('Exportando a Excel...');
    const worksheet = XLSX.utils.json_to_sheet(this.paymentSchedule);
    const workbook = {
      Sheets: { Cronograma: worksheet },
      SheetNames: ['Cronograma'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileName = 'cronograma_pagos.xlsx';
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(data, fileName);
  }

  resetForm() {
    this.createForm();
    this.showResults = false;
    this.paymentSchedule = [];
  }
}
