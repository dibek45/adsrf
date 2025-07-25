import { Component } from '@angular/core';
import { MenuBottomComponent } from '../menu-bottom/menu-bottom.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllBoletos } from '../state/boleto/boleto.selectors';
import { Boleto } from '../state/boleto/boleto.model';
import { take } from 'rxjs/operators';
import * as BoletoActions from '../state/boleto/boleto.actions';
import { FormsModule } from '@angular/forms';
import { BoletoItemComponent01 } from './boleto-item-new-01/boleto-item.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuBottomComponent, CommonModule,FormsModule,BoletoItemComponent01],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  telefonoBuscado: string = '';

onToggleBoleto(_t50: Boleto) {
throw new Error('Method not implemented.');
}
  mostrarResultados: boolean = false;
  boletos: Boleto[] = [];

  libres = 0;
  pagados = 0;
  apartados = 0;
telefonoIngresado: string = '';

  constructor(private store: Store) {}
numeroBuscado: string = '';
boletosEncontrados: Boleto[] = [];

onTelefonoChange(numero: string) {
  const telefono = numero.trim();
this.numeroBuscado=telefono
  console.log('📞 Teléfono ingresado:', telefono.length);

  if (!telefono || telefono.length < 2) {
    this.boletosEncontrados = [];
    return;
  }

  this.boletosEncontrados = this.boletos.filter(
    b => b.comprador?.telefono?.trim().includes(telefono)
  );

  console.log('📲 Boletos del comprador:', this.boletosEncontrados);
}


estadosDisponibles = ['pagado', 'ocupado', 'reservado', 'cancelado']; // añade más si quieres

filtrarPorEstado(estado: string) {
  return this.boletosEncontrados.filter(b =>
    b.comprador?.telefono?.length === 10 && b.estado === estado
  );
}


ngOnInit(): void {
  // 🟢 ¡Dispara la acción para cargar los boletos!
  this.store.dispatch(BoletoActions.loadBoletos());

  // 👀 Escucha el store hasta que lleguen los boletos
  this.store.select(selectAllBoletos).subscribe(boletos => {
    if (boletos.length === 0) return;

    console.log('📦 Boletos cargados desde el store:', boletos);
    this.boletos = boletos;
    this.calcularTotales();
  });
}


  onBuscarClick() {
    console.log('🔎 Buscando...');
    this.mostrarResultados = true;
    this.calcularTotales();
  }

  calcularTotales() {
    console.log('🧮 Calculando totales...');
    this.libres = this.boletos.filter(b => b.estado === 'disponible').length;
    this.pagados = this.boletos.filter(b => b.estado === 'pagado').length;
    this.apartados = this.boletos.filter(b => b.estado === 'ocupado').length;

    console.log('✅ Libres:', this.libres);
    console.log('✅ Pagados:', this.pagados);
    console.log('✅ Apartados:', this.apartados);
  }
}
