import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bottom',
  standalone: true,
  imports: [],
  templateUrl: './menu-bottom.component.html',
  styleUrl: './menu-bottom.component.scss'
})
export class MenuBottomComponent {
@Output() abrirModalSorteos = new EventEmitter<void>();
  @Output() abrirMenuConfig = new EventEmitter<void>();     // Para Config

    constructor(private router: Router) {}

  irAHome() {
        this.abrirModalSorteos.emit(); // 👈 este sí dispara el (abrirModalSorteos)
}

   emitirAbrirMenu() {
    this.abrirMenuConfig.emit(); // 🔧 Emitir evento para abrir el menú config
  }


  inicio(){
      this.router.navigate(['/home']);

  }

}
