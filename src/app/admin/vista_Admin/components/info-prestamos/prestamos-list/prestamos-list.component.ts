import { Component, OnInit } from '@angular/core';
import { PrestamosService } from '../../../services/prestamos.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Prestamo } from '../../../interfaces/Prestamo';
import { PrestamosFormComponent } from "../prestamos-form/prestamos-form.component";
import { HistorialPagosListComponent } from "../../info-pagos/historial-pagos-list/historial-pagos-list.component";


@Component({
  selector: 'app-prestamos-list',
  imports: [NgFor,NgIf, CommonModule, PrestamosFormComponent, HistorialPagosListComponent],
  templateUrl: './prestamos-list.component.html',
  styleUrl: './prestamos-list.component.css'
})
export class PrestamosListComponent implements OnInit {
  prestamos: Prestamo[] = [];
  selectedPrestamo: Prestamo | null = null;
  // Nueva propiedad para el préstamo seleccionado para pasar el cronograma de pagos
  prestamoParaHistorial: Prestamo | null = null; // Nueva propiedad

  constructor(
    private prestamosService: PrestamosService,
  ) {}

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
    this.prestamoParaHistorial = { ...prestamo }; // Asignamos para el historial

  }

  clearForm() {
    this.selectedPrestamo = null;
    this.prestamoParaHistorial = null; // Limpiamos también
  }

  verHistorial(prestamo: Prestamo) {
    this.prestamoParaHistorial = { ...prestamo }; // Método específico para historial
  }

}
