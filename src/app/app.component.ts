import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './supabase/auth.service';
import { FormsModule } from '@angular/forms';
import { LoginUserComponent } from "./login/login-user/login-user.component";
import { RegisterUserComponent } from "./login/register-user/register-user.component";

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
