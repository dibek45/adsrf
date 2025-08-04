import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Boleto } from '../../state/boleto/boleto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cambiar-estado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-estado-modal.component.html',
  styleUrls: ['./cambiar-estado-modal.component.scss']
})
export class CambiarEstadoModalComponent implements OnChanges {
ngOnChanges(changes: SimpleChanges): void {
  if (changes['reasignacion']) {
    this.confirmado = false;
    console.log('📢 Input `reasignacion` cambiado:', this.reasignacion);
  }
}
confirmado: boolean = false;

@Input() boleto!: Boleto;
@Output() estadoSeleccionado = new EventEmitter<'disponible' | 'ocupado' | 'pagado' | null>();
@Input() reasignacion: boolean = false;
@Output() reasignar = new EventEmitter<{ boleto: Boleto; nombre: string; telefono: string }>();
nuevoNombre: string = '';
nuevoTelefono: string = '';

  estados = ['disponible', 'ocupado', 'pagado'];

 cambiarEstado(estado: 'disponible' | 'ocupado' | 'pagado') {
  this.estadoSeleccionado.emit(estado);
}


  cerrar() {
    this.estadoSeleccionado.emit(null);
  }

  emitirReasignacion() {
  if (!this.nuevoNombre || !this.nuevoTelefono) {
    alert('Debes ingresar nombre y teléfono');
    return;
  }

  this.reasignar.emit({
    boleto: this.boleto,
    nombre: this.nuevoNombre,
    telefono: this.nuevoTelefono
  });
}
emitirReasignacionConEstado(estado: 'ocupado' | 'pagado') {
  if (!this.nuevoNombre || !this.nuevoTelefono) {
    alert('Debes ingresar nombre y teléfono');
    return;
  }

  this.reasignar.emit({
    boleto: {
      ...this.boleto,
      estado,
      comprador: {
        ...this.boleto.comprador,
        nombre: this.nuevoNombre,
        telefono: this.nuevoTelefono
      }
    },
    nombre: this.nuevoNombre,
    telefono: this.nuevoTelefono
  });
}

}
