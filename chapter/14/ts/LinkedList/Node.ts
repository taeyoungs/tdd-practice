class Node<T> {
  #value: T;
  #next: Node<T> | null;

  constructor(value: T) {
    this.#value = value;
    this.#next = null;
  }

  get value() {
    return this.#value;
  }

  get next() {
    return this.#next;
  }

  set next(newNode: Node<T> | null) {
    this.#next = newNode;
  }
}

export default Node;
