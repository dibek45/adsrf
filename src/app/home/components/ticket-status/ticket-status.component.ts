import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticket-status',
    standalone:true,
  imports:[],
  templateUrl: './ticket-status.component.html',
  styleUrls: ['./ticket-status.component.scss']
})
export class TicketStatusComponent {
  @Input() boletos: {
    total: number;
    disponibles: number;
    apartados: number;
    vendidos: number;
  } = { total: 0, disponibles: 0, apartados: 0, vendidos: 0 };
}
