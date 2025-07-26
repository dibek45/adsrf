import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Boleto } from '../../state/boleto/boleto.model';

@Component({
  selector: 'app-cambiar-estado-modal',
  standalone: true,
  imports: [],
  templateUrl: './cambiar-estado-modal.component.html',
  styleUrls: ['./cambiar-estado-modal.component.scss']
})
export class CambiarEstadoModalComponent {
  @Input() boleto!: Boleto;
@Output() estadoSeleccionado = new EventEmitter<'disponible' | 'ocupado' | 'pagado' | null>();

  estados = ['disponible', 'ocupado', 'pagado'];

 cambiarEstado(estado: 'disponible' | 'ocupado' | 'pagado') {
  this.estadoSeleccionado.emit(estado);
}


  cerrar() {
    this.estadoSeleccionado.emit(null);
  }
}
