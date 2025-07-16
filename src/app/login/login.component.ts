import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
    standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.username === 'admin' && this.password === '1234') {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }


  login() {
  // TODO: Aquí luego pondrás la validación real
  this.router.navigate(['/dashboard']);
}
}
