import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SolicitarModalComponent } from './solicitar-modal/solicitar-modal.component';
import { CommonModule } from '@angular/common';
import { Sorteo } from '../../state/boleto/boleto.model';

@Component({
  selector: 'app-total-raffles',
  standalone: true,
  imports: [SolicitarModalComponent, CommonModule],
  templateUrl: './total-raffles.component.html',
  styleUrls: ['./total-raffles.component.scss']
})
export class TotalRafflesComponent {
  @Input() total: number = 0;
  @Input() sorteos: Sorteo[] = [];
@Output() modalClosed = new EventEmitter<void>();

  @Output() selectSorteo = new EventEmitter<number>();

  modalAbierto = false;

  datosSorteo = {
    nombre: "5 mil pesos Misorteomx",
    descripcion: "BONO: ...",
    fecha: "2025-08-30T00:00:00.000Z",
    cierreVentas: "2025-08-30T17:00:00.000Z",
    costoBoleto: 100,
    totalBoletos: 330,
    numeroWhatsApp: "6145465066",
    nombreEmpresa: "Sorteos SA",
    mensajeWhatsappInfo: "¡Gracias por participar!"
  };

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    alert("cierra")
    this.modalAbierto = false;
      this.modalClosed.emit(); 

  }

  seleccionarSorteo(id: number) {
    this.selectSorteo.emit(id); // ⬅️ envía el id al componente padre
  }

  


}
