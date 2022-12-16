import Expression from './Expression';
import Money from './Money';
import HashTable from './HashTable';
import Pair from './Pair';

import { CURRENCY } from './constants';
import type { CurrencyTypes } from './constants';

class Bank {
  #hashTable: HashTable;

  constructor() {
    this.#hashTable = new HashTable();
  }

  reduce(source: Expression, to: CurrencyTypes): Money {
    return source.reduce(this, to);
  }

  rate(from: CurrencyTypes, to: CurrencyTypes) {
    const pair = new Pair(from, to);

    return this.#hashTable.get(pair);
  }

  addRate(from: CurrencyTypes, to: CurrencyTypes, rate: number) {
    const pair = new Pair(from, to);

    this.#hashTable.put(pair, rate);
  }
}

export default Bank;
