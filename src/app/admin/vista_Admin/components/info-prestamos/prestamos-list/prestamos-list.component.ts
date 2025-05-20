import { Component, OnInit } from '@angular/core';
import { PrestamosService } from '../../../services/prestamos.service';
import { NgFor } from '@angular/common';
import { Prestamo } from '../../../interfaces/Prestamo';
import { PrestamosFormComponent } from "../prestamos-form/prestamos-form.component";

@Component({
  selector: 'app-prestamos-list',
  imports: [NgFor, PrestamosFormComponent],
  templateUrl: './prestamos-list.component.html',
  styleUrl: './prestamos-list.component.css'
})
export class PrestamosListComponent implements OnInit {
  prestamos: Prestamo[] = [];
  selectedPrestamo: Prestamo | null = null;

  constructor(private prestamosService: PrestamosService) {}

  async ngOnInit() {
    await this.loadPrestamos();
  }

  async loadPrestamos() {
    this.prestamos = await this.prestamosService.getAll();
  }

  async deletePrestamo(id: string) {
    if (confirm('¿Estás seguro de eliminar este préstamo?')) {
      await this.prestamosService.delete(id);
      await this.loadPrestamos();
    }
  }

  selectPrestamo(prestamo: Prestamo) {
    this.selectedPrestamo = { ...prestamo };
  }

  clearForm() {
    this.selectedPrestamo = null;
  }
}
