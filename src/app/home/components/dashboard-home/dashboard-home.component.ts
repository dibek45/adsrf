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

@Component({
  selector: 'app-dashboard-home',
  standalone:true,
  imports:[       
    CommonModule,
    TotalRafflesComponent,
    TicketStatusComponent,
    TotalRevenueComponent,
    TopBuyersComponent,
    TopSellersComponent,
    SalesProgressComponent,
    NextRaffleComponent,
    RecentActivityComponent, MenuBottomComponent,
  SorteoSelectorComponent, MenuSettingsComponent ],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent {

  constructor(private router:Router){

  }
  sorteos: number[] = [];

ngOnInit() {
  const sorteosStr = localStorage.getItem('sorteos');
  if (sorteosStr) {
    this.sorteos = JSON.parse(sorteosStr);
    if (this.sorteos.length > 1) {
      this.abrirSelectorDeSorteo(); // modal si hay más de uno
    }
  }
}
  // Estos vendrán del estado de Redux más adelante
  totalSorteos = 3;
  boletos = {
    total: 200,
    disponibles: 50,
    apartados: 100,
    vendidos: 50,
  };
  recaudado = 15000;
  porRecaudar = 5000;
  topBuyers: any[] = [];
  topSellers: any[] = [];
  progresoVentas = [10, 30, 60, 80, 100];
  proximoSorteo = new Date('2025-08-30T18:00:00');
  actividadReciente = ['Boleto #100 pagado', 'Nuevo sorteo creado'];


  mostrarSelector = false;

amostrarSelector = false;


abrirSelectorDeSorteo() {
  this.mostrarSelector = true;
}

onSorteoSeleccionado(id: number) {
localStorage.setItem('sorteoId', id.toString());
  this.mostrarSelector = false;

  // Si usas rutas como /rifa/:id
  this.router.navigate(['/rifa', id]);

}

menuAbierto: boolean = false;

toggleMenu() {
   this.menuAbierto = !this.menuAbierto;

}

}
