import Money from './Money';

class Dollar extends Money {
  #amount;

  constructor(amount) {
    this.#amount = amount;
  }

  get amount() {
    return this.#amount;
  }

  times(multiplier) {
    return new Dollar(this.#amount * multiplier);
  }

  equals(instance) {
    return this.#amount === instance.amount;
  }
}

export default Dollar;
