  import { createReducer, on } from '@ngrx/store';
  import * as BoletoActions from './boleto.actions';
  import { Boleto } from './boleto.model';

  export interface BoletoState {
    boletos: Boleto[];
    boletosSeleccionados: Boleto[];
  }

  export const initialState: BoletoState = {
    boletos: [],
    boletosSeleccionados: []
  };

  export const boletoReducer = createReducer(
    initialState,

  on(BoletoActions.loadBoletosSuccess, (state, { boletos }) => {
    const seleccionados = state.boletosSeleccionados;

    const boletosActualizados = boletos.map(b => {
      const seleccionado = seleccionados.find(sel => sel.id === b.id);
      return seleccionado ? { ...b, estado: seleccionado.estado } : b;
    });

    // 👇 Aquí se ordena por número
    const boletosOrdenados = [...boletosActualizados].sort((a, b) => Number(a.numero) - Number(b.numero));

    return {
      ...state,
      boletos: boletosOrdenados,
    };
  }),



    on(BoletoActions.addBoleto, (state, { boleto }) => ({
      ...state,
      boletos: [...state.boletos, boleto]
    })),

    on(BoletoActions.removeBoleto, (state, { boletoId }) => ({
      ...state,
      boletos: state.boletos.filter(b => b.id !== boletoId),
      boletosSeleccionados: state.boletosSeleccionados.filter(b => b.id !== boletoId)
    })),



  on(BoletoActions.addBoletoSeleccionado, (state, { boleto }) => {
    const yaExiste = state.boletosSeleccionados.some(b => b.id === boleto.id);

    const actualizado = {
      ...state,
      boletos: state.boletos.map(b =>
        b.id === boleto.id ? boleto : b
      ),
      boletosSeleccionados: boleto.estado === 'ocupado' 
        ? yaExiste
          ? state.boletosSeleccionados
          : [...state.boletosSeleccionados, boleto]
        : state.boletosSeleccionados.filter(b => b.id !== boleto.id)
    };

    // ⚠️ Esto puede romper el patrón de NgRx
    console.log('🟥 REDUCER (NO recomendado):', actualizado);
    return actualizado;
  }),
on(BoletoActions.updateBoleto, (state, { boleto }) => ({
  ...state,
  boletos: state.boletos.map(b => b.id === boleto.id ? boleto : b),
  boletosSeleccionados: state.boletosSeleccionados.map(b =>
    b.id === boleto.id ? boleto : b
  )
})),



  on(BoletoActions.resetSeleccion, (state) => ({
    ...state,
    boletosSeleccionados: []
  })),


  
on(BoletoActions.deseleccionarYLiberarBoleto, (state, { boletoId }) => {
  console.log('🟡 Tipo de boletoId:', typeof boletoId);
  console.log('🟡 Estado actual:', state.boletosSeleccionados.map(b => ({ id: b.id, type: typeof b.id })));

  console.log('🟡 Reducer >> Deseleccionando boleto:', boletoId);

  const boletosActualizados = state.boletos.map(b =>
    b.id === boletoId ? { ...b, estado: 'disponible' as 'disponible' } : b
  );

  const seleccionadosActualizados = state.boletosSeleccionados.filter(b => b.id !== boletoId);

  console.log('✅ Nuevo estado de boletos:', boletosActualizados);
  console.log('✅ Nuevo estado de seleccionados:', seleccionadosActualizados);

  return {
    ...state,
    boletos: boletosActualizados,
    boletosSeleccionados: seleccionadosActualizados
  };
}),


  );
