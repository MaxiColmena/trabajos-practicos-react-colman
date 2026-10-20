export type Plato = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion?: string;
};

export const platos: Plato[] = [
  // Principal
  {
    id: 1,
    nombre: 'Milanesa con papas',
    precio: 7500,
    categoria: 'almuerzo',
    descripcion: 'Milanesa de carne o pollo con papas fritas.',
  },
  {
    id: 2,
    nombre: 'Hamburguesa completa',
    precio: 6500,
    categoria: 'almuerzo',
    descripcion: 'Hamburguesa con queso, lechuga, tomate y papas.',
  },
  {
    id: 3,
    nombre: 'Pizza especial',
    precio: 8000,
    categoria: 'almuerzo',
    descripcion: 'Muzzarella, jamón, morrones y aceitunas.',
  },
  
  // Desayuno
  {
    id: 4,
    nombre: 'Café con leche y medialunas',
    precio: 2500,
    categoria: 'desayuno',
    descripcion: 'Taza grande de café con leche con 3 medialunas.',
  },
  {
    id: 5,
    nombre: 'Tostado de jamón y queso',
    precio: 3000,
    categoria: 'desayuno',
    descripcion: 'Tostado en pan de miga o francés.',
  },
  {
    id: 6,
    nombre: 'Mate cocido con torta frita',
    precio: 1500,
    categoria: 'desayuno',
    descripcion: 'Tradicional mate cocido con 2 tortas fritas.',
  },

  // Bebidas
  {
    id: 7,
    nombre: 'Gaseosa 500ml',
    precio: 1500,
    categoria: 'bebidas',
    descripcion: 'Línea Coca-Cola o Pepsi a elección.',
  },
  {
    id: 8,
    nombre: 'Agua mineral',
    precio: 1000,
    categoria: 'bebidas',
    descripcion: 'Agua con o sin gas, 500ml.',
  },
  {
    id: 9,
    nombre: 'Jugo natural de naranja',
    precio: 1800,
    categoria: 'bebidas',
    descripcion: 'Exprimido fresco del día.',
  },

  // Kiosco
  {
    id: 10,
    nombre: 'Alfajor triple',
    precio: 1200,
    categoria: 'kiosco',
    descripcion: 'Alfajor de chocolate con dulce de leche.',
  },
  {
    id: 11,
    nombre: 'Turrón',
    precio: 400,
    categoria: 'kiosco',
    descripcion: 'Turrón de maní clásico.',
  },
  {
    id: 12,
    nombre: 'Papas fritas (snack)',
    precio: 1500,
    categoria: 'kiosco',
    descripcion: 'Paquete chico de papas fritas tipo snack.',
  }
];