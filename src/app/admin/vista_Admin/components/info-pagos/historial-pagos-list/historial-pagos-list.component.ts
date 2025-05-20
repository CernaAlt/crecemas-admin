import { Component, OnInit } from '@angular/core';
import { HistorialPago } from '../../../interfaces/historial-pago.model';
import { HistorialPagosService } from '../../../services/historial-pagos.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-pagos-list',
  imports: [NgFor,RouterLink,DatePipe],
  templateUrl: './historial-pagos-list.component.html',
  styleUrl: './historial-pagos-list.component.css'
})
export class HistorialPagosListComponent implements OnInit {

  pagos:HistorialPago[]=[];
  loading = false;


  constructor(private pagosService: HistorialPagosService) {
  
  }

  async ngOnInit() {
    this.loading = true;
  try {
    this.pagos = await this.pagosService.getAll();
    console.log('Datos de pagos cargados:', this.pagos); // ← Aquí
  } catch (error) {
    console.error('Error cargando pagos:', error);
  } finally {
    this.loading = false; // Se ejecuta siempre (éxito o error)
  }

  }

  async deletePago(id: string) {
    if (confirm('¿Deseas eliminar este pago?')) {
      try {
        await this.pagosService.delete(id);
        this.pagos = this.pagos.filter(p => p.id !== id);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }
}
