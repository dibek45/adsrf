import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Boleto } from './boleto.model';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletoService {
  private apiUrl = 'https://api.sorteos.sa.dibeksolutions.com/boleto/044';

  constructor(private http: HttpClient) {}
getBoletos(): Observable<Boleto[]> {
  console.log('⏳ Haciendo petición al API...');

  const request$ = this.http.get<Boleto[]>(this.apiUrl);

  // 🔍 Solo para debug, puedes quitarlo después
  request$.subscribe({
    next: (boletos) => console.log('✅ Respuesta de API:', boletos),
    error: (err) => console.error('❌ Error al llamar API:', err)
  });

  return request$;
}

 private boletosSimulados: Boleto[] = [
   
    // Agrega más si quieres probar
  ];

  apartarBoleto(numero: string): Observable<any> {
    return of(true).pipe(
      delay(500), // Simula retardo de red
      switchMap(() => {
        const encontrado = this.boletosSimulados.find(b => b.numero === numero);
        if (!encontrado || encontrado.estado !== 'disponible') {
          return throwError(() => new Error('Ya ocupado'));
        }

        // Marca como ocupado
        encontrado.estado = 'ocupado';
        return of(true);
      })
    );
  }


  updateBoleto(boleto: Boleto): Observable<Boleto> {
  const url = `${this.apiUrl}/${boleto.id}`;
  return this.http.patch<Boleto>(url, { estado: boleto.estado });
}

}
