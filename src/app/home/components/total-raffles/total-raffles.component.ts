import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-total-raffles',
    standalone:true,
  imports:[],
  templateUrl: './total-raffles.component.html',
  styleUrls: ['./total-raffles.component.scss']
})
export class TotalRafflesComponent {
  @Input() total: number = 0;
    @Output() selectSorteo = new EventEmitter<void>();

  abrirModal() {
    this.selectSorteo.emit();
  }
}
