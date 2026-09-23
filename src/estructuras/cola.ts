export class Cola<T> {
  #items: T[] = [];
  #inicio = 0;

  encolar(x: T): void {
    this.#items.push(x);
  }

  desencolar(): T | undefined {
    if (this.vacia) return undefined;

    const x = this.#items[this.#inicio];
    this.#inicio++;

    if (this.#inicio * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#inicio);
      this.#inicio = 0;
    }

    return x;
  }

  frente(): T | undefined {
    return this.vacia ? undefined : this.#items[this.#inicio];
  }

  get vacia(): boolean {
    return this.#items.length - this.#inicio === 0;
  }

  get tamanio(): number {
    return this.#items.length - this.#inicio;
  }

  aArray(): T[] {
    return this.#items.slice(this.#inicio);
  }
}