import { Component, Input } from '@angular/core';
import { MenuBottomComponent } from '../menu-bottom/menu-bottom.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllBoletos, selectBoletosPorSorteo, selectBoletosSeleccionadosPorSorteo } from '../state/boleto/boleto.selectors';
import { Boleto } from '../state/boleto/boleto.model';
import { take } from 'rxjs/operators';
import * as BoletoActions from '../state/boleto/boleto.actions';
import { FormsModule } from '@angular/forms';
import { BoletoItemComponent01 } from './boleto-item-new-01/boleto-item.component';
import { SearchNumberComponent } from './search-number/search-number.component';
import { CambiarEstadoModalComponent } from './cambiar-estado-modal/cambiar-estado-modal.component';
import { BoletoService } from '../state/boleto/boleto.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { BoletoSyncService } from '../sockets/boleto-sync.service';
import { SocketService } from '../sockets/socket.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuSettingsComponent } from './components/menu-settings/menu-settings.component';
import { SorteoSelectorComponent } from '../home/components/sorteo-selector-component/sorteo-selector-component.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuBottomComponent, 
    CommonModule,
    FormsModule,BoletoItemComponent01,SearchNumberComponent,CambiarEstadoModalComponent,MenuSettingsComponent,SorteoSelectorComponent ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  mostrarSelector = false;

sorteoId: number = 0;
  nombreSorteo: any;

cambiarTodos(_t49: string) {

  
throw new Error('Method not implemented.');
}



nombreUsuario: string = '';

estadoFiltrado: 'disponible' | 'pagado' | 'ocupado' | null = null;

@Input() reasignacion: boolean = false;
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
  telefonoBuscado: string = '';

onToggleBoleto(boleto: Boleto) {
  this.modalBoleto = boleto;

}

actualizandoBoleto = false;

  mostrarResultados: boolean = false;
  boletos: Boleto[] = [];
modalBoleto: Boleto | null = null;

  libres = 0;
  pagados = 0;
  apartados = 0;
  boletoActualizadoId: string | null = null;

telefonoIngresado: string = '';

  constructor(private store: Store,
     private boletoService: BoletoService,
     private whatsAppService: WhatsAppService,
       private socketService: SocketService,
  private boletoSyncService: BoletoSyncService,
      private toastService: ToastService,
        private route: ActivatedRoute,// ⬅️ Aquí,
        private router:Router

  
    ) {}






numeroBuscado: string = '';
boletosEncontrados: Boleto[] = [];



onTelefonoChange(numero: string) {
  const telefono = numero.trim();
  this.numeroBuscado = telefono;
  console.log('📞 Teléfono ingresado:', telefono);

  if (!telefono || telefono.length < 2) {
    this.boletosEncontrados = [];
    return;
  }

  // 🔍 Paso 1: Filtrar boletos válidos que coincidan con el teléfono
  const encontrados = this.boletos.filter(
    b =>
      b.comprador?.telefono?.trim().includes(telefono) &&
      b.comprador?.nombre?.trim()   );

  console.log('📋 Encontrados (sin filtrar duplicados):', encontrados);

  // 🔐 Paso 2: Eliminar duplicados por comprador.id
  const compradorMap = new Map<number, Boleto>();

  for (const b of encontrados) {
    const id = b.comprador?.id;
    if (id && !compradorMap.has(id)) {
      compradorMap.set(id, b);
    }
  }

  // 🎯 Resultado limpio
  this.boletosEncontrados = Array.from(compradorMap.values());

  console.log('✅ Boletos únicos por comprador.id:', this.boletosEncontrados);
}




estadosDisponibles = ['pagado', 'ocupado', 'reservado', 'cancelado', 'disponible'];
filtrarPorEstado(estado: string): Boleto[] {
  return this.boletosEncontrados.filter(b => b.estado === estado);
}
  private sub: Subscription = new Subscription();



inicializarSorteo() {
  this.socketService.joinSorteoRoom(this.sorteoId);
  this.boletoSyncService.listenToSocketUpdates(this.sorteoId);

  this.store.dispatch(BoletoActions.loadBoletos({ sorteoId: this.sorteoId }));

  this.sub.add(
    this.socketService.boletoUpdated$.subscribe((boleto) => {
      const actual = this.boletos.find(b => b.id === boleto.id);
      const esIgual = actual && JSON.stringify(actual) === JSON.stringify(boleto);
      if (esIgual) return;

      this.store.dispatch(
        BoletoActions.updateBoletoEnStore({ sorteoId: this.sorteoId, boleto })
      );
    })
  );

  this.store.select(selectBoletosPorSorteo(this.sorteoId)).subscribe(boletos => {
    if (boletos.length === 0) return;

    this.boletos = boletos;

    // Verifica si algún boleto seleccionado ya no está disponible
    this.store.select(selectBoletosSeleccionadosPorSorteo(this.sorteoId)).pipe(take(1)).subscribe(selected => {
      const boletosRemovidos = selected.filter(sel => {
        const actualizado = boletos.find(b => b.id === sel.id);
        return actualizado && actualizado.estado !== 'disponible';
      });

      if (boletosRemovidos.length > 0) {
        boletosRemovidos.forEach(b => {
          this.toastService.show(`❌ Boleto ${b.numero} ya no está disponible (${b.estado})`, 4000);
        });

        this.store.dispatch(
          BoletoActions.deseleccionarBoletos({
            sorteoId: this.sorteoId,
            ids: boletosRemovidos.map(b => b.id)
          })
        );
      }
    });

    // Aplica filtros si los hay
    if (this.estadoFiltrado) {
      this.filtrarPorDashboard(this.estadoFiltrado);
    } else if (this.numeroBuscado.trim()) {
      this.onTelefonoChange(this.numeroBuscado);
    }

    this.calcularTotales();
  });
}

onSorteoSeleccionado(id: number) {
  const nombre = `Sorteo #${id}`; // O usa el nombre real si lo tienes

  localStorage.setItem('sorteoId', id.toString());
  localStorage.setItem('sorteoNombre', nombre);

  this.nombreSorteo = nombre; // ⬅️ ¡Actualiza la propiedad que ve el HTML!
  this.sorteoId = id;
  this.mostrarSelector = false;

  this.router.navigate(['/rifa', id]);
}



ngOnInit(): void {
  // Cargar los sorteos disponibles (por ejemplo, para el modal)
  const sorteosStr = localStorage.getItem('sorteos');
  if (sorteosStr) {
    this.sorteos = JSON.parse(sorteosStr);
  }

  this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

  this.sub.add(
    this.route.params.subscribe(params => {
      const nuevoId = Number(params['id']) || Number(localStorage.getItem('sorteoId'));

      if (!nuevoId) {
        console.error('❌ No se encontró sorteoId en params ni en localStorage');
        return;
      }

      this.sorteoId = nuevoId;
      localStorage.setItem('sorteoId', this.sorteoId.toString());

      this.inicializarSorteo();
    })
  );

  this.nombreSorteo = localStorage.getItem('sorteoNombre') || `Sorteo #${this.sorteoId}`;

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

onEstadoSeleccionado(nuevoEstado: 'disponible' | 'ocupado' | 'pagado' | null) {
  if (!nuevoEstado || !this.modalBoleto) {
    this.modalBoleto = null;
    return;
  }

  this.actualizandoBoleto = true; // 🌀 Mostrar spinner

  const actualizado: Boleto = {
    ...this.modalBoleto,
    estado: nuevoEstado
  };

  this.boletoService.updateBoleto(actualizado).subscribe({
    next: () => {
this.store.dispatch(BoletoActions.updateBoleto({ sorteoId: this.sorteoId, boleto: actualizado }));
this.boletos = this.boletos.map(b => b.id === actualizado.id ? actualizado : b); // actualiza array local

if (this.estadoFiltrado) {
  this.filtrarPorDashboard(this.estadoFiltrado);
} else if (this.numeroBuscado.trim()) {
  this.onTelefonoChange(this.numeroBuscado);
}

this.calcularTotales();


      this.boletoActualizadoId = actualizado.id;

      setTimeout(() => {
        this.boletoActualizadoId = null;
      }, 2000);

      this.modalBoleto = null;
      this.actualizandoBoleto = false;
    },
    error: (err) => {
      console.error('❌ Error actualizando boleto:', err);
      alert('Error al guardar el boleto');
      this.modalBoleto = null;
      this.actualizandoBoleto = false;
    }
  });
}

onCompradorSeleccionado(info: { telefono: string; compradorId: number }) {
  this.numeroBuscado = info.telefono;

  // Filtrar todos los boletos del comprador por ID
  this.boletosEncontrados = this.boletos.filter(
    b => b.comprador?.id === info.compradorId
  );

  this.mostrarResultados = true;

  console.log('🎯 Comprador seleccionado:', info, this.boletosEncontrados);
}
get boletosPagados(): Boleto[] {
  return this.boletosEncontrados.filter(b => b.estado === 'pagado');
}

get boletosOcupados(): Boleto[] {
  return this.boletosEncontrados.filter(b => b.estado === 'ocupado');
}

get boletosNoDisponibles(): Boleto[] {
  return this.boletosEncontrados.filter(b => b.estado !== 'disponible');
}



enviarInfo(): void {
  const sorteoId = Number(localStorage.getItem('sorteoId')); // 🔹 Obtiene el sorteo activo (guardado en login)

  const comprador = this.boletosEncontrados[0]?.comprador; // 🔹 Toma el primer comprador filtrado por teléfono

  if (comprador?.telefono) {
    console.log('📤 Enviando mensaje con sorteo:', sorteoId);

    this.whatsAppService.enviarMensajeDeConsulta(
      comprador.nombre,
      comprador.telefono,
      sorteoId // 🔥 Aquí manda el ID del sorteo
    );
  } else {
    alert('No se encontró el teléfono del comprador.');
  }
}


filtrarPorDashboard(estado: 'disponible' | 'pagado' | 'ocupado') {
  console.log('📥 Filtro seleccionado:', estado);

  this.estadoFiltrado = estado;

  this.boletosEncontrados = this.boletos.filter(b => b.estado === estado);

  console.log(`🎯 Boletos filtrados (${estado}):`, this.boletosEncontrados);

  this.numeroBuscado = ''; // Limpiar campo de búsqueda

  console.log('🔄 númeroBuscado reseteado');
}

mostrarInfoBoleto(boleto: Boleto) {
  alert(`🎟️ Boleto #${boleto.numero}\nEstado: ${boleto.estado.toUpperCase()}\nComprador: ${boleto.comprador?.nombre || 'Sin nombre'}\nTeléfono: ${boleto.comprador?.telefono || 'Sin teléfono'}`);
}


esReasignacion(boleto: Boleto): boolean {
  // Si está disponible, entonces debe mostrar el formulario
  const resultado = boleto.estado === 'disponible';
  console.log('🧪 ¿Es reasignación/asignación?', resultado, 'Estado:', boleto.estado, 'Comprador:', boleto.comprador);
  return resultado;
}

onReasignar(data: { boleto: Boleto; nombre: string; telefono: string }) {
  this.actualizandoBoleto = true;

  const actualizado: Boleto = {
    ...data.boleto,
    estado: 'ocupado', // o el estado que desees poner
    comprador: {
      ...data.boleto.comprador,
      nombre: data.nombre,
      telefono: data.telefono
    }
  };

  this.boletoService.updateBoleto(actualizado).subscribe({
    next: () => {
this.store.dispatch(BoletoActions.updateBoleto({ sorteoId: this.sorteoId, boleto: actualizado }));
      this.boletos = this.boletos.map(b => b.id === actualizado.id ? actualizado : b);

        if (this.estadoFiltrado) {
          this.filtrarPorDashboard(this.estadoFiltrado);
        } else if (this.numeroBuscado.trim()) {
          this.onTelefonoChange(this.numeroBuscado);
        }

        this.modalBoleto = null;
        this.actualizandoBoleto = false;
        this.calcularTotales();

    },
    error: () => {
      alert('❌ Error al reasignar el boleto');
      this.actualizandoBoleto = false;
    }
  });
}

ngOnChanges() {
  console.log('🧪 Reasignación recibida:', this.reasignacion);
}

menuAbierto: boolean = false;

toggleMenu() {
  this.menuAbierto = !this.menuAbierto;
}
abrirSelectorDeSorteo() {
  this.mostrarSelector = true;
}





cerrarModal() {
  this.mostrarSelector = false;
}
}


