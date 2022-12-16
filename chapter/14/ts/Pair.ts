import { CurrencyTypes } from './constants';

class Pair {
  #from: CurrencyTypes;
  #to: CurrencyTypes;

  constructor(from: CurrencyTypes, to: CurrencyTypes) {
    this.#from = from;
    this.#to = to;
  }

  get from() {
    return this.#from;
  }

  get to() {
    return this.#to;
  }

  equals(newPair: Pair) {
    return this.from === newPair.from && this.to === newPair.to;
  }

  hashCode() {
    return 0;
  }
}

export default Pair;
