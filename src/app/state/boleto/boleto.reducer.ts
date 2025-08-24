// boleto.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as BoletoActions from './boleto.actions';
import { Boleto } from './boleto.model';

export interface BoletoState {
  boletos: { [sorteoId: number]: Boleto[] };
  boletosSeleccionados: { [sorteoId: number]: Boleto[] };
}

export const initialState: BoletoState = {
  boletos: {},
  boletosSeleccionados: {},
};

export const boletoReducer = createReducer(
  initialState,

  // Cargar boletos por sorteo
  on(BoletoActions.loadBoletosSuccess, (state, { sorteoId, boletos }) => {
    const seleccionados = state.boletosSeleccionados[sorteoId] || [];

    const boletosActualizados = boletos.map(b => {
      const seleccionado = seleccionados.find(sel => sel.id === b.id);
      return seleccionado ? { ...b, estado: seleccionado.estado } : b;
    });

    const ordenados = [...boletosActualizados].sort((a, b) => Number(a.numero) - Number(b.numero));

    return {
      ...state,
      boletos: {
        ...state.boletos,
        [sorteoId]: ordenados,
      },
    };
  }),

  // Agregar un boleto
  on(BoletoActions.addBoleto, (state, { sorteoId, boleto }) => ({
    ...state,
    boletos: {
      ...state.boletos,
      [sorteoId]: [...(state.boletos[sorteoId] || []), boleto],
    },
  })),

  // Eliminar un boleto
  on(BoletoActions.removeBoleto, (state, { sorteoId, boletoId }) => ({
    ...state,
    boletos: {
      ...state.boletos,
      [sorteoId]: (state.boletos[sorteoId] || []).filter(b => b.id !== boletoId),
    },
    boletosSeleccionados: {
      ...state.boletosSeleccionados,
      [sorteoId]: (state.boletosSeleccionados[sorteoId] || []).filter(b => b.id !== boletoId),
    },
  })),

  // Seleccionar un boleto
  on(BoletoActions.addBoletoSeleccionado, (state, { sorteoId, boleto }) => {
    const seleccionados = state.boletosSeleccionados[sorteoId] || [];
    const yaExiste = seleccionados.some(b => b.id === boleto.id);

    return {
      ...state,
      boletos: {
        ...state.boletos,
        [sorteoId]: (state.boletos[sorteoId] || []).map(b => b.id === boleto.id ? boleto : b),
      },
      boletosSeleccionados: {
        ...state.boletosSeleccionados,
        [sorteoId]:
          boleto.estado === 'ocupado' || boleto.estado === 'seleccionado'
            ? yaExiste
              ? seleccionados
              : [...seleccionados, boleto]
            : seleccionados.filter(b => b.id !== boleto.id),
      },
    };
  }),

  // Actualizar boleto manualmente
  on(BoletoActions.updateBoleto, (state, { sorteoId, boleto }) => ({
    ...state,
    boletos: {
      ...state.boletos,
      [sorteoId]: (state.boletos[sorteoId] || []).map(b => b.id === boleto.id ? boleto : b),
    },
    boletosSeleccionados: {
      ...state.boletosSeleccionados,
      [sorteoId]: (state.boletosSeleccionados[sorteoId] || []).map(b => b.id === boleto.id ? boleto : b),
    },
  })),

  // Actualizar desde socket
  on(BoletoActions.updateBoletoEnStore, (state, { sorteoId, boleto }) => ({
    ...state,
    boletos: {
      ...state.boletos,
      [sorteoId]: (state.boletos[sorteoId] || []).map(b => b.id === boleto.id ? boleto : b),
    },
    boletosSeleccionados: {
      ...state.boletosSeleccionados,
      [sorteoId]: (state.boletosSeleccionados[sorteoId] || []).map(b => b.id === boleto.id ? boleto : b),
    },
  })),

  // Deseleccionar y liberar
  on(BoletoActions.deseleccionarYLiberarBoleto, (state, { sorteoId, boletoId }) => {
    const boletosActualizados = (state.boletos[sorteoId] || []).map(b =>
      b.id === boletoId ? { ...b, estado: 'disponible' as const } : b
    );

    const seleccionadosActualizados = (state.boletosSeleccionados[sorteoId] || []).filter(b => b.id !== boletoId);

    return {
      ...state,
      boletos: {
        ...state.boletos,
        [sorteoId]: boletosActualizados,
      },
      boletosSeleccionados: {
        ...state.boletosSeleccionados,
        [sorteoId]: seleccionadosActualizados,
      },
    };
  }),

  // Deseleccionar varios
  on(BoletoActions.deseleccionarBoletos, (state, { sorteoId, ids }) => ({
    ...state,
    boletosSeleccionados: {
      ...state.boletosSeleccionados,
      [sorteoId]: (state.boletosSeleccionados[sorteoId] || []).filter(b => !ids.includes(b.id)),
    },
  })),

  // Reset selección
  on(BoletoActions.resetSeleccion, (state, { sorteoId }) => ({
    ...state,
    boletosSeleccionados: {
      ...state.boletosSeleccionados,
      [sorteoId]: [],
    },
  }))
);
