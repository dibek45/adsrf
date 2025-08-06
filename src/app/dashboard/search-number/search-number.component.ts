import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Boleto } from '../../state/boleto/boleto.model';
type ResultadoBusqueda =
  | {
      comprador: Boleto['comprador'];
      cantidad: number;
      tipo: 'boleto';
      numero: number;
    }
  | {
      comprador: Boleto['comprador'];
      cantidad: number;
      tipo: 'telefono';
    };


@Component({
  selector: 'app-search-number',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-number.component.html',
  styleUrls: ['./search-number.component.scss']
})
export class SearchNumberComponent {
  @Input() boletos: Boleto[] = [];

  @Output() telefonoChange = new EventEmitter<string>();
  @Output() compradorSeleccionado = new EventEmitter<{ telefono: string, compradorId: number }>();

  telefono: string = '';

  resultados: ResultadoBusqueda[] = [];

  


buscarPorTelefono() {
  const tel = this.telefono.trim();

  this.resultados = [];

  // 🔢 Buscar por número de boleto
  if (/^\d+$/.test(tel)) {
    const encontrado = this.boletos.find(b => String(b.numero) === tel);
    if (encontrado && encontrado.comprador) {
      this.resultados = [{
        comprador: encontrado.comprador,
        cantidad: 1,
        tipo: 'boleto',
numero: Number(encontrado.numero),
      }];
      this.telefonoChange.emit(tel);
      return;
    }
  }

  // 📞 Buscar por teléfono normalmente
  const map = new Map<number, ResultadoBusqueda>();

  for (const b of this.boletos) {
    const comprador = b.comprador;
    const match = comprador?.telefono?.includes(tel);
    if (match && comprador?.id && b.estado !== 'disponible') {
      const current = map.get(comprador.id);
      if (current) {
        current.cantidad++;
      } else {
        map.set(comprador.id, {
          comprador,
          cantidad: 1,
          tipo: 'telefono'
        });
      }
    }
  }

  this.resultados = Array.from(map.values());
  this.telefonoChange.emit(tel);
}





limpiarTelefono() {
  this.telefono = '';
  this.resultados = [];
  this.telefonoChange.emit('');
  console.log('🔄 Teléfono y resultados limpiados');
}


  seleccionarPorComprador(comprador: Boleto['comprador']) {
    const telefonoCompleto = comprador?.telefono?.trim() || '';
    if (comprador?.id) {
      this.compradorSeleccionado.emit({
        telefono: telefonoCompleto,
        compradorId: comprador.id
      });
    }
    this.telefono = telefonoCompleto;
    this.resultados = [];
  }
}
