import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from '../environments/environment';

// 🧹 Limpieza automática solo en desarrollo
if (!environment.production) {
  // Limpiar localStorage y sessionStorage
  //localStorage.clear();
  sessionStorage.clear();

  // Limpiar cookies
  document.cookie.split(';').forEach(c => {
    const nombre = c.trim().split('=')[0];
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  alert('🧹 Limpieza de caché y cookies en modo desarrollo');
}

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('❌ Error al iniciar la app:', err));
