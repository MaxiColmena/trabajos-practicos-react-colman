export type Plato = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
};

export const platos: Plato[] = [
  {
    id: 1,
    nombre: "Milanesa con papas",
    precio: 7500,
    categoria: "Principal",
  },
  {
    id: 2,
    nombre: "Hamburguesa completa",
    precio: 6500,
    categoria: "Principal",
  },
  {
    id: 3,
    nombre: "Pizza especial",
    precio: 8000,
    categoria: "Principal",
  },
  {
    id: 4,
    nombre: "Ensalada completa",
    precio: 5000,
    categoria: "Ensalada",
  },
  {
    id: 5,
    nombre: "Gaseosa",
    precio: 2000,
    categoria: "Bebida",
  },
];