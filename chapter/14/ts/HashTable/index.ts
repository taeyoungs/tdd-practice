import LinkedList from '../LinkedList';
import Node from '../LinkedList/Node';
import Pair from '../Pair';

class HashTable {
  #table: Map<number, LinkedList>;

  constructor() {
    this.#table = new Map<number, LinkedList>();
  }

  put(pair: Pair, value: number) {
    const hash = pair.hashCode();
    const node = new Node(pair, value);

    const linkedList = this.#table.get(hash);
    if (!linkedList) {
      const newLinkedList = new LinkedList();
      newLinkedList.add(node);

      this.#table.set(hash, newLinkedList);
      return;
    }

    if (linkedList.contains(node)) {
      linkedList.set(pair, value);
      return;
    }

    linkedList.add(node);
  }

  get(pair: Pair) {
    const hash = pair.hashCode();

    const linkedList = this.#table.get(hash);
    if (!linkedList) {
      throw new ReferenceError('Pair does not exist');
    }

    return linkedList.get(pair);
  }
}

export default HashTable;
