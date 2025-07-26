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

  telefono: string = '';
  resultados: Boleto[] = [];

 buscarPorTelefono() {
  const tel = this.telefono.trim();

  if (tel.length < 3) {
    this.resultados = [];
    this.telefonoChange.emit(''); // ⚠️ para limpiar también en el padre
    return;
  }

  this.resultados = this.boletos.filter(
    b => b.comprador?.telefono?.includes(tel)
  );

  this.telefonoChange.emit(tel); // 🔥 importante para notificar al padre
}
seleccionarBoleto(boleto: Boleto) {
  const telefonoCompleto = boleto.comprador?.telefono?.trim() || '';
  this.telefono = telefonoCompleto;
  this.telefonoChange.emit(telefonoCompleto); // 🔥 notifica al padre
  this.resultados = []; // limpia los resultados después de seleccionar
}
limpiarTelefono() {
  this.telefono = '';
  this.resultados = [];
  this.telefonoChange.emit('');
}

}
