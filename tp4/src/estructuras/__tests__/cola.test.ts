import { describe, expect, test } from '@jest/globals';
import { Cola } from '../cola';

describe('Cola', () => {
  test('empieza vacía', () => {
    const cola = new Cola<string>();
    expect(cola.vacia).toBe(true);
    expect(cola.tamanio).toBe(0);
    expect(cola.frente()).toBeUndefined();
  });

  test('el primero que entra es el primero que sale', () => {
    const cola = new Cola<string>();
    cola.encolar('Lucía');
    cola.encolar('Brenda');
    cola.encolar('Maxi');
    expect(cola.desencolar()).toBe('Lucía');
    expect(cola.desencolar()).toBe('Brenda');
    expect(cola.frente()).toBe('Maxi');
    expect(cola.tamanio).toBe(1);
  });

  test('desencolar una cola vacía devuelve undefined y no rompe', () => {
    const cola = new Cola<string>();
    expect(cola.desencolar()).toBeUndefined();
    expect(cola.tamanio).toBe(0);
    cola.encolar('Agus');
    expect(cola.desencolar()).toBe('Agus');
    expect(cola.desencolar()).toBeUndefined();
  });

  test('mantiene el orden después de compactar', () => {
    const cola = new Cola<number>();
    for (let i = 1; i <= 10; i++) cola.encolar(i);
    for (let i = 1; i <= 6; i++) cola.desencolar();
    cola.encolar(11);
    expect(cola.aArray()).toEqual([7, 8, 9, 10, 11]);
    expect(cola.tamanio).toBe(5);
  });

  test('aArray devuelve una copia en orden de llegada', () => {
    const cola = new Cola<string>();
    cola.encolar('a');
    cola.encolar('b');
    const copia = cola.aArray();
    copia.push('c');
    expect(cola.aArray()).toEqual(['a', 'b']);
  });

  test('clonar crea una cola independiente', () => {
    const original = new Cola<string>();
    original.encolar('a');
    const copia = original.clonar();
    copia.encolar('b');
    copia.desencolar();
    expect(original.aArray()).toEqual(['a']);
    expect(copia.aArray()).toEqual(['b']);
  });
});
