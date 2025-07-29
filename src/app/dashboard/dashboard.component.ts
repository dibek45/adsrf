import { Component, Input } from '@angular/core';
import { MenuBottomComponent } from '../menu-bottom/menu-bottom.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllBoletos } from '../state/boleto/boleto.selectors';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuBottomComponent, 
    CommonModule,
    FormsModule,BoletoItemComponent01,SearchNumberComponent,CambiarEstadoModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
cambiarTodos(_t49: string) {
throw new Error('Method not implemented.');
}
estadoFiltrado: 'disponible' | 'pagado' | 'ocupado' | null = null;

@Input() reasignacion: boolean = false;

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
  private boletoSyncService: BoletoSyncService
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




ngOnInit(): void {
  // 🟢 ¡Dispara la acción para cargar los boletos!


    const sorteoId = 1; // o de tus inputs, store, ruta, etc.

  this.socketService.joinSorteoRoom(sorteoId);
  this.boletoSyncService.listenToSocketUpdates(sorteoId);
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
      this.store.dispatch(BoletoActions.updateBoleto({ boleto: actualizado }));
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
  const comprador = this.boletosEncontrados[0]?.comprador;
  if (comprador?.telefono) {
    this.whatsAppService.enviarMensajeDeConsulta(comprador.nombre, comprador.telefono);
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
      this.store.dispatch(BoletoActions.updateBoleto({ boleto: actualizado }));
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
}


