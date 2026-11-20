import { useState } from 'react';
import { mezclar } from '../lib/aleatorio';
import type { Libro } from '../types';

export type ItemCatalogo = {
  clave: string; // ISBN + número de tanda: el mismo libro aparece en varias tandas
  libro: Libro;
};

// Scroll infinito: al llegar al final se agrega otra tanda con los mismos libros mezclados
export function useCatalogoInfinito(libros: Libro[]) {
  const [tandasExtra, setTandasExtra] = useState<Libro[][]>([]);

  const items: ItemCatalogo[] = [libros, ...tandasExtra].flatMap((tanda, numero) =>
    tanda.map((libro) => ({ clave: `${libro.isbn}-${numero}`, libro })),
  );

  function cargarMas() {
    if (libros.length === 0) return;
    setTandasExtra((anteriores) => [...anteriores, mezclar(libros)]);
  }

  return { items, cargarMas };
}
