import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  login(form: any) {
    if (!form.valid) {
      alert('Por favor, llena todos los campos');
      return;
    }

    const payload = {
      email: this.username,
      password: this.password
    };

    console.log('📤 Enviando payload al backend:', payload);

    this.http.post<string>(
      'https://api.sorteos.sa.dibeksolutions.com/auth/login',
      payload,
      { responseType: 'text' as 'json' }
    ).subscribe({
      next: (token: string) => {
        console.log('🧾 Token recibido del backend:', token);

        // ⚠️ Detectar error devuelto como texto plano
        if (!token || token.length < 10 || token.includes('INVALID')) {
          this.error = 'Usuario o contraseña incorrectos';
          console.warn('⚠️ Token inválido o error recibido como string plano');
          return;
        }

        try {
          const decoded: any = jwtDecode(token);
            console.log('✅ Token decodificado:', decoded);

            // Guarda token y sorteoId
            localStorage.setItem('token', token);

            const sorteoId = decoded?.sorteos?.[0]; // 🔥 asume que solo tiene uno
            if (!sorteoId) {
              console.error('❌ No se encontró sorteoId en el token');
              this.error = 'Token inválido (sin sorteo)';
              return;
            }

localStorage.setItem('nombreUsuario', decoded?.nombre);
if (decoded?.sorteos?.length) {
  const sorteosCompletos = decoded.sorteos.map((id: number, index: number) => ({
    id,
    nombre: `Sorteo ${id}`,
    boletos: [],
    recaudado: 0,
    porRecaudar: 0,
    progresoVentas: [],
    fechaSorteo: new Date(),
    topBuyers: [],
    topSellers: [],
  }));

  localStorage.setItem('sorteos', JSON.stringify(sorteosCompletos));
}

if (!sorteoId) {
  this.error = 'Token inválido (sin sorteo)';
  return;
}

this.router.navigate(['/home']);

        } catch (e) {
          console.error('❌ Error decoding token:', e);
          this.error = 'Token inválido recibido del servidor';
        }
      },
      error: (err) => {
        console.error('❌ Error HTTP al hacer login:', err);
        this.error = 'Error de red o del servidor';
      }
    });
  }
}
