import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './supabase/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crecemas_Dashboard';

  constructor(private authService: AuthService) {
    this.authService.initializeSession();
  }
}
