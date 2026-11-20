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

// Si el texto son solo números (con o sin guiones o espacios), devuelve esos dígitos; si no, null
export function digitosDeCodigo(texto: string): string | null {
  return /^[\d\s-]+$/.test(texto) ? texto.replace(/[-\s]/g, '') : null;
}

// Búsqueda por código: el ISBN completo o una parte (ej.: los últimos números)
export function buscarPorCodigo(digitos: string): Libro[] {
  return LIBROS.filter((l) => l.isbn.includes(digitos));
}

// URL de la tapa en Open Library, o null si no tenemos una cargada
export function urlPortada(isbn: string): string | null {
  const id = PORTADAS[isbn];
  return id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : null;
}
