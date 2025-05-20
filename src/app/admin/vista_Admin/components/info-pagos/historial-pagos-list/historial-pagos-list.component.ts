import { Component, Input, OnInit } from '@angular/core';
import { HistorialPago } from '../../../interfaces/historial-pago.model';
import { HistorialPagosService } from '../../../services/historial-pagos.service';
import { NgFor } from '@angular/common';
import { HistorialPagosFormComponent } from '../historial-pagos-form/historial-pagos-form.component';

@Component({
  selector: 'app-historial-pagos-list',
  imports: [NgFor,HistorialPagosFormComponent],
  templateUrl: './historial-pagos-list.component.html',
  styleUrl: './historial-pagos-list.component.css',
})
export class HistorialPagosListComponent implements OnInit {
  historialPagos: HistorialPago[] = [];
  selectedPago: HistorialPago | null = null;

  constructor(private pagosService: HistorialPagosService) {}

  ngOnInit(): void {
    this.loadHistorialPagos();
  }

  loadHistorialPagos(): void {
    this.pagosService.getAll().then((pagos) => {
      this.historialPagos = pagos;
    });
  }

  selectHistorialPago(pago: HistorialPago): void {
    this.selectedPago = { ...pago };
  }

  deleteHistorialPago(id: string): void {
    if (confirm('¿Estás seguro de eliminar este pago?')) {
      this.pagosService.delete(id).then(() => {
        this.loadHistorialPagos();
      });
    }
  }

  clearForm(): void {
    this.selectedPago = null;
  }

}
