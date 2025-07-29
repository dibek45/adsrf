import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Boleto } from '../state/boleto/boleto.model';
import { loadBoletosSuccess } from '../state/boleto/boleto.actions';
import { SocketService } from './socket.service';
import { selectAllBoletos } from '../state/boleto/boleto.selectors';
import { take } from 'rxjs/operators';
import { ToastService } from '../toast/toast.service';

@Injectable({ providedIn: 'root' })
export class BoletoSyncService {
  constructor(
    private socketService: SocketService,
    private store: Store,
    private toastService: ToastService
  ) {}

listenToSocketUpdates(sorteoId: number) {
  console.log('👂 Suscribiéndome a socket...');

  this.socketService.boletoUpdated$.subscribe((updated: Boleto) => {
    console.log('📨 Recibido en BoletoSyncService:', updated);
  this.toastService.show(`Boleto actualizado: ${updated.numero}`, 3000);
    if (Number(updated.sorteo?.id) !== Number(sorteoId)) return;

    this.store.select(selectAllBoletos).pipe(take(1)).subscribe((boletos) => {
      const existente = boletos.find((b) => b.id === updated.id);

      // Evita el loop infinito: no actualices si no hay cambios
      if (existente && JSON.stringify(existente) === JSON.stringify(updated)) {
        console.log('🔁 Boleto ya estaba igual, no se actualiza store.');
        return;
      }

      const nuevaLista = [
        ...boletos.filter((b) => b.id !== updated.id),
        updated,
      ];

      this.store.dispatch(loadBoletosSuccess({ boletos: nuevaLista }));
      console.log('✅ Boleto actualizado por socket y actualizado en Redux');
    });
  });
}


}
