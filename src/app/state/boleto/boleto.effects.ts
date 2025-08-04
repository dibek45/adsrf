import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { isPlatformBrowser } from '@angular/common';
import * as BoletoActions from './boleto.actions';
import { BoletoService } from './boleto.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

@Injectable()
export class BoletoEffects {
  private platformId = inject(PLATFORM_ID);
  private actions$ = inject(Actions); // ✅ Usa inject en lugar de this.actions$

  constructor(private boletoService: BoletoService) {}

loadBoletos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(BoletoActions.loadBoletos),
    mergeMap(({ sorteoId }) => {
      if (!isPlatformBrowser(this.platformId)) {
        console.log('🚫 SSR: efecto de boletos cancelado');
        return EMPTY;
      }

      return this.boletoService.getBoletos(sorteoId).pipe(
        map(boletos => BoletoActions.loadBoletosSuccess({ boletos })),
        catchError(error => {
          console.error('[Boleto API] Error:', error);
          return of({ type: '[Boleto API] Load Failed' });
        })
      );
    })
  )
);


updateBoleto$ = createEffect(() =>
  this.actions$.pipe(
    ofType(BoletoActions.updateBoleto),
    mergeMap(({ boleto }) =>
      this.boletoService.updateBoleto(boleto).pipe(
        map(() => {
          console.log('✅ Boleto actualizado en el backend');
          return { type: '[Boleto] Update Backend Success' };
        }),
        catchError(error => {
          console.error('❌ Error en updateBoleto effect:', error);
          return of({ type: '[Boleto] Update Failed' });
        })
      )
    )
  ),
  { dispatch: false } // si solo querés que actualice y no emita nada
);

}
