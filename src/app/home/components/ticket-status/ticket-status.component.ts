import { Component, Input } from '@angular/core';
import { Boleto } from '../../../state/boleto/boleto.model';

@Component({
  selector: 'app-ticket-status',
    standalone:true,
  imports:[],
  templateUrl: './ticket-status.component.html',
  styleUrls: ['./ticket-status.component.scss']
})
export class TicketStatusComponent {
 @Input() boletos: Boleto[] = [];

 get total() {
  return this.boletos.length;
}
get disponibles() {
  return this.boletos.filter(b => b.estado === 'disponible').length;
}
get apartados() {
  return this.boletos.filter(b => b.estado === 'ocupado').length;
}
get vendidos() {
  return this.boletos.filter(b => b.estado === 'pagado').length;
}

}
