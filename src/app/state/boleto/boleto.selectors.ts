import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoletoState } from './boleto.reducer';

export const selectBoletoState = createFeatureSelector<BoletoState>('boleto');

export const selectBoletos = createSelector(
  selectBoletoState,
  (state) => state.boletos
);

export const selectSelectedBoletos = createSelector(
  selectBoletoState,
  (state) => state.boletosSeleccionados
);
export const selectAllBoletos = selectBoletos; // alias para usarlo con nombre más claro
export const selectBoletosSeleccionados = createSelector(
  selectBoletoState,
  state => state.boletosSeleccionados
);



