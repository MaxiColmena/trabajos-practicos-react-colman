import { LIBROS } from '../data/libros';
import { PORTADAS } from '../data/portadas';
import type { Libro } from '../types';

// Un ISBN válido para la app: exactamente 13 dígitos
export function esIsbnValido(isbn: string): boolean {
  return /^\d{13}$/.test(isbn);
}

export function buscarLibroPorIsbn(isbn: string): Libro | undefined {
  return LIBROS.find((l) => l.isbn === isbn);
}

// URL de la tapa en Open Library, o null si no tenemos una cargada
export function urlPortada(isbn: string): string | null {
  const id = PORTADAS[isbn];
  return id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : null;
}
