// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('🚫 No hay token, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        console.warn('🔒 Token expirado, redirigiendo a login');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } catch (e) {
      console.error('❌ Token inválido');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
