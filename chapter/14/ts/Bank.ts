import Expression from './Expression';
import Money from './Money';
import HashTable from './HashTable';
import Pair from './Pair';

import type { CurrencyTypes } from './constants';

class Bank {
  #rates: HashTable;

  constructor() {
    this.#rates = new HashTable();
  }

  reduce(source: Expression, to: CurrencyTypes): Money {
    return source.reduce(this, to);
  }

  rate(from: CurrencyTypes, to: CurrencyTypes) {
    if (from === to) {
      return 1;
    }

    const pair = new Pair(from, to);

    return this.#rates.get(pair);
  }

  addRate(from: CurrencyTypes, to: CurrencyTypes, rate: number) {
    const pair = new Pair(from, to);

    this.#rates.put(pair, rate);
  }
}

export default Bank;
