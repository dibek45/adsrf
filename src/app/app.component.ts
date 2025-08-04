import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private authService: AuthService){
  this.authService.checkTokenExpiration();

  setInterval(() => {
    this.authService.checkTokenExpiration();
  }, 60 * 1000); // cada 60 segundos
  }
  title = 'adsrf';
}
