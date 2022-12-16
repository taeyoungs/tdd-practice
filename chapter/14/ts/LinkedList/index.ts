import Pair from '../Pair';
import Node from './Node';

class LinkedList {
  #first: Node | null;
  #last: Node | null;
  #length: number;

  constructor() {
    this.#first = null;
    this.#last = null;
    this.#length = 0;
  }

  get first() {
    return this.#first;
  }

  set first(newNode: Node | null) {
    this.#first = newNode;
  }

  get last() {
    return this.#last;
  }

  set last(newNode: Node | null) {
    this.#last = newNode;
  }

  get length() {
    return this.#length;
  }

  set length(len: number) {
    this.#length = len;
  }

  add(newNode: Node) {
    this.length = this.length + 1;

    if (this.first === null || this.last === null) {
      this.first = newNode;
      this.last = newNode;
      return;
    }

    this.last.next = newNode;
    this.last = newNode;
  }

  contains(comparisonNode: Node) {
    let node = this.first;

    while (node !== null) {
      if (node.equals(comparisonNode)) {
        return true;
      }

      node = node.next;
    }

    return false;
  }

  get(pair: Pair) {
    let node = this.first;

    while (node !== null) {
      if (node.key.equals(pair)) {
        return node.value;
      }

      node = node.next;
    }

    return null;
  }

  set(pair: Pair, value: number) {
    let node = this.first;

    while (node !== null) {
      if (node.key.equals(pair)) {
        node.value = value;
        return;
      }

      node = node.next;
    }

    throw new ReferenceError('Pair does not exist');
  }
}

export default LinkedList;
