import type { Libro } from '../types';

// Los dos últimos son libros que tengo en casa, con su ISBN real,
// para probar el escáner con la contratapa.
export const LIBROS: Libro[] = [
  { isbn: '9788445073209', titulo: 'El Hobbit', autor: 'J. R. R. Tolkien', anio: 1937, ejemplares: 2 },
  { isbn: '9788445073216', titulo: 'La Comunidad del Anillo', autor: 'J. R. R. Tolkien', anio: 1954, ejemplares: 0 },
  { isbn: '9788445073223', titulo: 'Las Dos Torres', autor: 'J. R. R. Tolkien', anio: 1954, ejemplares: 1 },
  { isbn: '9788445073230', titulo: 'El Retorno del Rey', autor: 'J. R. R. Tolkien', anio: 1955, ejemplares: 0 },
  { isbn: '9788445073247', titulo: 'El Silmarillion', autor: 'J. R. R. Tolkien', anio: 1977, ejemplares: 1 },
  { isbn: '9788445073254', titulo: 'Los Hijos de Húrin', autor: 'J. R. R. Tolkien', anio: 2007, ejemplares: 1 },
  { isbn: '9789504910213', titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', anio: 1943, ejemplares: 3 },
  { isbn: '9788498384123', titulo: 'El libro de la vida', autor: 'Deborah Harkness', anio: 2014, ejemplares: 1 },
  { isbn: '9788499081137', titulo: 'Harry Potter y la piedra filosofal', autor: 'J. K. Rowling', anio: 1997, ejemplares: 0 },
  { isbn: '9788498383607', titulo: 'El nombre del viento', autor: 'Patrick Rothfuss', anio: 2007, ejemplares: 1 },
  { isbn: '9788499082547', titulo: 'El león, la bruja y el ropero', autor: 'C. S. Lewis', anio: 1950, ejemplares: 2 },
  { isbn: '9788427203402', titulo: 'Los Juegos del Hambre', autor: 'Suzanne Collins', anio: 2008, ejemplares: 2 },
  { isbn: '9788499180113', titulo: 'Eragon', autor: 'Christopher Paolini', anio: 2002, ejemplares: 1 },
  { isbn: '9788496284623', titulo: 'Juego de Tronos', autor: 'George R. R. Martin', anio: 1996, ejemplares: 1 },
  { isbn: '9788499083971', titulo: 'El código Da Vinci', autor: 'Dan Brown', anio: 2003, ejemplares: 2 },
  { isbn: '9788420441863', titulo: 'Percy Jackson y el ladrón del rayo', autor: 'Rick Riordan', anio: 2005, ejemplares: 1 },
  { isbn: '9788498381702', titulo: 'La historia interminable', autor: 'Michael Ende', anio: 1979, ejemplares: 1 },
  // Pendientes: reemplazar por los ISBN reales de la contratapa
  { isbn: '9789500710008', titulo: 'Libro de casa 1', autor: 'Autor a completar', anio: 2000, ejemplares: 1 },
  { isbn: '9789500710015', titulo: 'Libro de casa 2', autor: 'Autor a completar', anio: 2000, ejemplares: 0 },
];

// Personas que ya estaban esperando cuando arranca la app (por ISBN)
export const ESPERA_INICIAL: Record<string, string[]> = {
  '9788445073216': ['Lucía', 'Tomás'],
  '9788445073230': ['Brenda'],
  '9788499081137': ['Agus', 'Nahuel'],
};
