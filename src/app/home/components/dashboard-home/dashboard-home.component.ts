import { Component, EventEmitter, Output } from '@angular/core';
import { RecentActivityComponent } from '../recent-activity/recent-activity.component';
import { NextRaffleComponent } from '../next-raffle/next-raffle.component';
import { SalesProgressComponent } from '../sales-progress/sales-progress.component';
import { TotalRevenueComponent } from '../total-revenue/total-revenue.component';
import { TicketStatusComponent } from '../ticket-status/ticket-status.component';
import { TotalRafflesComponent } from '../total-raffles/total-raffles.component';
import { TopBuyersComponent } from '../top-buyers/top-buyers.component';
import { TopSellersComponent } from '../top-sellers/top-sellers.component';
import { Router } from '@angular/router';
import { MenuBottomComponent } from '../../../menu-bottom/menu-bottom.component';
import { SorteoSelectorComponent } from '../sorteo-selector-component/sorteo-selector-component.component';
import { MenuSettingsComponent } from '../../../dashboard/components/menu-settings/menu-settings.component';
import { CommonModule } from '@angular/common';
import { Sorteo } from '../../../state/boleto/boleto.model';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    TotalRafflesComponent,
    TicketStatusComponent,
    TotalRevenueComponent,
    TopBuyersComponent,
    TopSellersComponent,
    SalesProgressComponent,
    NextRaffleComponent,
    RecentActivityComponent,
    MenuBottomComponent,
    SorteoSelectorComponent,
    MenuSettingsComponent,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent {
  sorteosVisibles: boolean[] = [];
  mostrarSelector = false;
  menuAbierto: boolean = false;
   progresoVentas = [10, 30, 60, 80, 100];
  proximoSorteo = new Date('2025-08-30T18:00:00');

  // 🔥 ESTE array sí debe tener los datos completos por sorteo:
  sorteos: {
    id: number;
    nombre: string;
    boletos: any;
    recaudado: number;
    porRecaudar: number;
    progresoVentas: number[];
    fechaSorteo: string | Date;
    topBuyers: any[];
    topSellers: any[];
  }[] = [];

  actividadReciente = ['Boleto #100 pagado', 'Nuevo sorteo creado'];

  constructor(private router: Router) {}
ngOnInit() {
  const sorteosStr = localStorage.getItem('sorteos');

  if (sorteosStr) {
    try {
      this.sorteos = JSON.parse(sorteosStr);

      if (!Array.isArray(this.sorteos) || this.sorteos.length === 0) {
        console.warn('[⚠] Sorteos está vacío o no es un array:', this.sorteos);
      } else {
        console.log('[✅] Sorteos cargados:', this.sorteos);
      }

    } catch (err) {
      console.error('[❌] Error al parsear sorteos del localStorage:', err);
    }
  } else {
    console.warn('[⚠] No se encontró "sorteos" en localStorage');
  }

  this.sorteosVisibles = this.sorteos.map(() => false);
}


  abrirSelectorDeSorteo() {
    this.mostrarSelector = true;
  }

  cerrarModal() {
    this.mostrarSelector = false;
  }

  onSorteoSeleccionado(id: number) {
    localStorage.setItem('sorteoId', id.toString());
    this.mostrarSelector = false;
    this.router.navigate(['/rifa', id]);
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleSorteo(index: number) {
    this.sorteosVisibles[index] = !this.sorteosVisibles[index];
  }
}

