import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Boleto } from '../../state/boleto/boleto.model';

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

  resultados: {
    comprador: Boleto['comprador'];
    cantidad: number;
  }[] = [];

buscarPorTelefono() {
  const tel = this.telefono.trim();

  if (tel.length < 3) {
    this.resultados = [];
    this.telefonoChange.emit('');
    return;
  }

  const map = new Map<number, { comprador: Boleto['comprador'], cantidad: number }>();

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
      cantidad: 1
    });
  }
}

  }

  this.resultados = Array.from(map.values());
  this.telefonoChange.emit(tel);

  // 🚀 Si escribieron un número completo y solo hay un resultado: seleccionar automáticamente
  if (tel.length === 10 && this.resultados.length === 1) {
    const resultado = this.resultados[0];
    this.compradorSeleccionado.emit({
      telefono: resultado.comprador?.telefono?.trim() || '',
      compradorId: resultado.comprador?.id!
    });
    this.resultados = [];
  }
}


  limpiarTelefono() {
    this.telefono = '';
    this.resultados = [];
    this.telefonoChange.emit('');
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
