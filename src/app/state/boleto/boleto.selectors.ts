import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoletoState } from './boleto.reducer';

// 🎯 Accede al estado global de boletos
export const selectBoletoState = createFeatureSelector<BoletoState>('boleto');

// 🔍 Selector para obtener todos los boletos agrupados por sorteo
export const selectBoletos = createSelector(
  selectBoletoState,
  (state) => state.boletos
);

// 🔍 Selector para obtener boletos por sorteoId
export const selectBoletosPorSorteo = (sorteoId: number) => createSelector(
  selectBoletos,
  (boletos) => boletos[sorteoId] || []
);

// 🔍 Selector para obtener los seleccionados agrupados por sorteo
export const selectBoletosSeleccionados = createSelector(
  selectBoletoState,
  (state) => state.boletosSeleccionados
);

// 🔍 Selector para obtener boletos seleccionados por sorteoId
export const selectBoletosSeleccionadosPorSorteo = (sorteoId: number) => createSelector(
  selectBoletosSeleccionados,
  (seleccionados) => seleccionados[sorteoId] || []
);

// 🧠 Alias opcionales (si te gusta mantenerlos)
export const selectAllBoletos = selectBoletos;
