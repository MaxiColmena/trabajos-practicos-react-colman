import { LIBROS } from '../data/libros';
import type { Libro } from '../types';

// Un ISBN válido para la app: exactamente 13 dígitos
export function esIsbnValido(isbn: string): boolean {
  return /^\d{13}$/.test(isbn);
}

export function buscarLibroPorIsbn(isbn: string): Libro | undefined {
  return LIBROS.find((l) => l.isbn === isbn);
}
