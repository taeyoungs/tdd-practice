import Dollar from './Dollar';

class Money {
  #amount;

  constructor(amount) {
    this.#amount = amount;
  }

  get amount() {
    return this.#amount;
  }

  equals(instance) {
    const isSameConstructor = this.constructor === instance.constructor;

    return this.amount === instance.amount && isSameConstructor;
  }

  static dollar(amount) {
    return new Dollar(amount);
  }
}

export default Money;
