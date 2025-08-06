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
  @Output() abrirMenuConfig = new EventEmitter<void>();

    constructor(private router: Router) {}

  irAHome() {
        this.abrirModalSorteos.emit(); 
}

   emitirAbrirMenu() {
    this.abrirMenuConfig.emit();
  }

  inicio(){
      this.router.navigate(['/home']);
  }

}
