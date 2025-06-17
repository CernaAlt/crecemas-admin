import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-ajustes',
  imports: [FormsModule],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.css',
})
export class AjustesComponent {
  tema: 'claro' | 'oscuro' = 'claro';
  idioma: 'es' | 'en' = 'es';
  filtroDaltonico = false;
  fuenteGrande = false;

  ngOnInit() {
    this.cargarPreferencias();
    this.aplicarAjustes();
  }

  guardarPreferencias() {
    localStorage.setItem(
      'ajustes',
      JSON.stringify({
        tema: this.tema,
        idioma: this.idioma,
        filtroDaltonico: this.filtroDaltonico,
        fuenteGrande: this.fuenteGrande,
      })
    );
    this.aplicarAjustes();
  }

  cargarPreferencias() {
    const ajustes = localStorage.getItem('ajustes');
    if (ajustes) {
      const prefs = JSON.parse(ajustes);
      this.tema = prefs.tema;
      this.idioma = prefs.idioma;
      this.filtroDaltonico = prefs.filtroDaltonico;
      this.fuenteGrande = prefs.fuenteGrande;
    }
  }

  aplicarAjustes() {
    document.body.classList.toggle('dark', this.tema === 'oscuro');
    document.body.classList.toggle('daltonic', this.filtroDaltonico);
    document.body.style.fontSize = this.fuenteGrande ? '18px' : '16px';
    // Puedes agregar lógica para aplicar traducciones si usas ngx-translate u otro servicio
  }
}
