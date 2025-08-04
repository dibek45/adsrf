import { createAction, props } from '@ngrx/store';
import { Boleto } from './boleto.model';

export const loadBoletos = createAction(
  '[Boleto] Load Boletos',
  props<{ sorteoId: number }>()
);

export const loadBoletosSuccess = createAction(
  '[Boleto] Load Boletos Success',
  props<{ boletos: Boleto[] }>()
);

export const addBoleto = createAction(
  '[Boleto] Add Boleto',
  props<{ boleto: Boleto }>()
);

export const removeBoleto = createAction(
  '[Boleto] Remove Boleto',
  props<{ boletoId: string }>()
);

export const addBoletoSeleccionado = createAction(
  '[Boletos] Add Boleto Seleccionado',
  props<{ boleto: Boleto }>()
);

export const deseleccionarYLiberarBoleto = createAction(
  '[Boletos] Deseleccionar y Liberar Boleto',
  props<{ boletoId: string }>()
);
export const resetSeleccion = createAction('[Boleto] Reset Selección');
export const updateBoleto = createAction(
  '[Boleto] Update Boleto',
  props<{ boleto: Boleto }>()
);


export const updateBoletoEnStore = createAction(
  '[Boleto] Actualizado desde socket',
  props<{ boleto: Boleto }>()
);


export const deseleccionarBoletos = createAction(
  '[Boleto] Deseleccionar Boletos',
  props<{ ids: string[] }>() // 👈 Usa string[] en lugar de number[]
);
