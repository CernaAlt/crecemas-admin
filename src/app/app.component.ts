import { Component } from '@angular/core';
import { AuthService } from './supabase/auth.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crecemas_Dashboard';

  constructor(private authService: AuthService) {
    this.authService.initializeSession();
  }
}
