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
import { MenuBottomComponent } from '../../menu-bottom/menu-bottom.component';
import { SorteoSelectorComponent } from '../sorteo-selector-component/sorteo-selector-component.component';
import { MenuSettingsComponent } from '../../dashboard/components/menu-settings/menu-settings.component';
import { CommonModule } from '@angular/common';
import { Sorteo } from '../../state/boleto/boleto.model';

import { Store } from '@ngrx/store';
import { selectBoletosPorSorteo } from '../../state/boleto/boleto.selectors';
import { Boleto } from '../../state/boleto/boleto.model';
import { take } from 'rxjs';
import * as BoletoActions from '../../state/boleto/boleto.actions';

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
export class MisRifasComponent {
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

  constructor(private router: Router,
  private store: Store
  ) {}
ngOnInit() {
  const sorteosStr = localStorage.getItem('sorteos');

  if (!sorteosStr) {
    console.warn('[⚠] No se encontró "sorteos" en localStorage');
    return;
  }

  try {
    const sorteosCargados = JSON.parse(sorteosStr);
    console.log('[✅] Sorteos cargados desde localStorage:', sorteosCargados);

    if (!Array.isArray(sorteosCargados) || sorteosCargados.length === 0) {
      console.warn('[⚠] Sorteos no es un array válido o está vacío');
      return;
    }

    sorteosCargados.forEach((s: any, index: number) => {
      console.log(`\n📦 Procesando sorteo con ID ${s.id} (${s.nombre})...`);

      // 1. Disparar acción para cargar boletos
      this.store.dispatch(BoletoActions.loadBoletos({ sorteoId: s.id }));

      // 2. Suscribirse al store
      this.store.select(selectBoletosPorSorteo(s.id)).subscribe((boletos: Boleto[]) => {
        console.log(`🎟️ Boletos recibidos para sorteo ${s.id}:`, boletos);

        const recaudado = boletos
          .filter(b => b.estado === 'pagado')
          .reduce((acc, b) => acc + (Number(b.precio) || 0), 0);

        const total = boletos.reduce((acc, b) => acc + (Number(b.precio) || 0), 0);

        const porRecaudar = total - recaudado;
        const progreso = total > 0 ? Math.round((recaudado / total) * 100) : 0;

        const compradoresMap = new Map<string, { nombre: string; total: number }>();
        const vendedoresMap = new Map<string, { nombre: string; total: number }>();

        boletos.forEach(b => {
          const precio = Number(b.precio) || 0;

          // Comprador (agrupa por ID o nombre)
          if (b.estado === 'pagado') {
            const compradorKey = b.comprador?.id?.toString() || `nombre:${b.comprador?.nombre}`;
            if (compradorKey) {
const actual = compradoresMap.get(compradorKey) || {
  nombre: b.comprador?.nombre || 'Desconocido',
  total: 0,
  telefono: b.comprador?.telefono || null // ✅ aquí el número
};
actual.total += precio;
              actual.total += precio;
              compradoresMap.set(compradorKey, actual);
              console.log('✅ Comprador agregado:', actual);
            } else {
              console.warn('⚠️ Comprador no identificado en boleto pagado:', b);
            }

            // Vendedor (agrupa por ID o nombre)
            const vendedorKey = b.vendedor?.id?.toString() || `nombre:${b.vendedor?.nombre}`;
            if (vendedorKey) {
              const actual = vendedoresMap.get(vendedorKey) || { nombre: b.vendedor?.nombre || 'Desconocido', total: 0 };
              actual.total += precio;
              vendedoresMap.set(vendedorKey, actual);
              console.log('✅ Vendedor agregado:', actual);
            } else {
              console.warn('⚠️ Vendedor no identificado en boleto pagado:', b);
            }
          }
        });

        const topBuyers = Array.from(compradoresMap.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        const topSellers = Array.from(vendedoresMap.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        const sorteoProcesado = {
          id: s.id,
          nombre: s.nombre,
          boletos,
          recaudado,
          porRecaudar,
          progresoVentas: [progreso],
          fechaSorteo: s.fechaSorteo || '',
          topBuyers,
          topSellers,
        };

        this.sorteos[index] = sorteoProcesado;
        console.log('✅ Sorteo procesado:', sorteoProcesado);
      });
    });
  } catch (err) {
    console.error('[❌] Error al parsear "sorteos" desde localStorage:', err);
  }
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


  filtrarYRedirigir(sorteoId: number, estado: 'disponible' | 'ocupado' | 'pagado') {
  localStorage.setItem('sorteoId', sorteoId.toString());
  localStorage.setItem('estadoFiltrado', estado);
this.router.navigate(['/rifa', sorteoId], { queryParams: { estado } });
}
}

