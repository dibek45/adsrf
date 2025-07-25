export interface Boleto {
  id: string;
  numero: string;
  precio: number;
  estado: 'disponible' | 'ocupado' | 'pagado';
  metodoPago: string | null;
  fechaCompra: string | null;
  compradorId: number;
  vendedorId: number | null;
  comprador: Comprador;
  vendedor: Vendedor | null;
}

export interface Comprador {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  createdAt: string;
}

export interface Vendedor {
  id: number;
  nombre: string;
  // agrega más si los necesitas
}
