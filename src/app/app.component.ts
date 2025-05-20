import { Component } from '@angular/core';
import { AuthService } from './supabase/auth.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [ RouterOutlet], // Importa ambos
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crecemas_Dashboard';

  /*constructor(private authService: AuthService) {
    this.authService.initializeSession();
  }*/
}
