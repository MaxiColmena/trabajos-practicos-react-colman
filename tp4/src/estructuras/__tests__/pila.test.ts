import { describe, expect, test } from '@jest/globals';
import { Pila } from '../pila';

describe('Pila', () => {
  test('empieza vacía', () => {
    const pila = new Pila<string>();
    expect(pila.vacia).toBe(true);
    expect(pila.tamanio).toBe(0);
    expect(pila.tope()).toBeUndefined();
  });

  test('el último que entra es el primero que sale', () => {
    const pila = new Pila<string>();
    pila.push('El Hobbit');
    pila.push('Las Dos Torres');
    pila.push('El Silmarillion');
    expect(pila.pop()).toBe('El Silmarillion');
    expect(pila.pop()).toBe('Las Dos Torres');
    expect(pila.tamanio).toBe(1);
  });

  test('tope mira sin sacar', () => {
    const pila = new Pila<number>();
    pila.push(1);
    pila.push(2);
    expect(pila.tope()).toBe(2);
    expect(pila.tamanio).toBe(2);
  });

  test('sacar de una pila vacía devuelve undefined', () => {
    const pila = new Pila<string>();
    expect(pila.pop()).toBeUndefined();
    expect(pila.tamanio).toBe(0);
  });

  test('aArray devuelve una copia en orden de base a tope', () => {
    const pila = new Pila<string>();
    pila.push('a');
    pila.push('b');
    const copia = pila.aArray();
    copia.push('c');
    expect(pila.aArray()).toEqual(['a', 'b']);
  });

  test('clonar crea una pila independiente', () => {
    const original = new Pila<string>();
    original.push('a');
    const copia = original.clonar();
    copia.push('b');
    expect(original.tamanio).toBe(1);
    expect(copia.aArray()).toEqual(['a', 'b']);
  });
});
