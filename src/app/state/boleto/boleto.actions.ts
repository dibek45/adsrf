import { createAction, props } from '@ngrx/store';
import { Boleto } from './boleto.model';

export const loadBoletos = createAction(
  '[Boleto] Load Boletos',
  props<{ sorteoId: number }>()
);

export const loadBoletosSuccess = createAction(
  '[Boleto] Load Boletos Success',
  props<{ sorteoId: number; boletos: Boleto[] }>()
);

export const addBoleto = createAction(
  '[Boleto] Add Boleto',
  props<{ sorteoId: number; boleto: Boleto }>()
);

export const removeBoleto = createAction(
  '[Boleto] Remove Boleto',
  props<{ sorteoId: number; boletoId: string }>()
);

export const addBoletoSeleccionado = createAction(
  '[Boletos] Add Boleto Seleccionado',
  props<{ sorteoId: number; boleto: Boleto }>()
);

export const deseleccionarYLiberarBoleto = createAction(
  '[Boletos] Deseleccionar y Liberar Boleto',
  props<{ sorteoId: number; boletoId: string }>()
);

export const resetSeleccion = createAction(
  '[Boleto] Reset Selección',
  props<{ sorteoId: number }>()
);

export const updateBoleto = createAction(
  '[Boleto] Update Boleto',
  props<{ sorteoId: number; boleto: Boleto }>()
);

export const updateBoletoEnStore = createAction(
  '[Boleto] Actualizado desde socket',
  props<{ sorteoId: number; boleto: Boleto }>()
);

export const deseleccionarBoletos = createAction(
  '[Boleto] Deseleccionar Boletos',
  props<{ sorteoId: number; ids: string[] }>() // 👈 ids por sorteo
);
