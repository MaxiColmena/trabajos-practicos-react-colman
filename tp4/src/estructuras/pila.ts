// Misma Pila del TP 2, con clonar() para poder reemplazarla en el estado
export class Pila<T> {
  #items: T[] = [];

  push(x: T): void {
    this.#items.push(x);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  tope(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  get vacia(): boolean {
    return this.#items.length === 0;
  }

  get tamanio(): number {
    return this.#items.length;
  }

  aArray(): T[] {
    return [...this.#items];
  }

  // Devuelve una pila nueva con los mismos elementos
  clonar(): Pila<T> {
    const copia = new Pila<T>();
    this.#items.forEach((x) => copia.push(x));
    return copia;
  }
}
