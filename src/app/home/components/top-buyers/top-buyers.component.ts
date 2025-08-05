import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-buyers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-buyers.component.html',
  styleUrl: './top-buyers.component.scss'
})
export class TopBuyersComponent {
  @Input() buyers: any[] = []; // 👈 ESTA LÍNEA ES CLAVE

}
