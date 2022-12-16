import Node from './Node';

class LinkedList<T> {
  #first: Node<T> | null;
  #last: Node<T> | null;
  #length: number;

  constructor() {
    this.#first = null;
    this.#last = null;
    this.#length = 0;
  }

  get first() {
    return this.#first;
  }

  set first(newNode: Node<T> | null) {
    this.#first = newNode;
  }

  get last() {
    return this.#last;
  }

  set last(newNode: Node<T> | null) {
    this.#last = newNode;
  }

  get length() {
    return this.#length;
  }

  set length(len: number) {
    this.#length = len;
  }

  add(newNode: Node<T>) {
    this.length = this.length + 1;

    if (this.first === null || this.last === null) {
      this.first = newNode;
      this.last = newNode;
      return;
    }

    this.last.next = newNode;
    this.last = newNode;
  }

  contains(comparisonNode: Node<T>) {
    let node = this.first;

    while (node !== null) {
      if (node.equals(comparisonNode)) {
        return true;
      }

      node = node.next;
    }

    return false;
  }
}

export default LinkedList;
