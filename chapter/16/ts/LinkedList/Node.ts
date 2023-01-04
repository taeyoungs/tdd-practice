import Pair from '../Pair';

class Node {
  #key: Pair;
  #value: number;
  #next: Node | null;

  constructor(key: Pair, value: number) {
    this.#key = key;
    this.#value = value;
    this.#next = null;
  }

  get key() {
    return this.#key;
  }

  get value() {
    return this.#value;
  }

  set value(newValue: number) {
    this.#value = newValue;
  }

  get next() {
    return this.#next;
  }

  set next(newNode: Node | null) {
    this.#next = newNode;
  }

  equals(anotherNode: Node | null) {
    if (!anotherNode) {
      return false;
    }

    return this.key.equals(anotherNode.key);
  }
}

export default Node;
