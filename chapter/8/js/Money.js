import Dollar from './Dollar';
import Franc from './Franc';

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

  static franc(amount) {
    return new Franc(amount);
  }
}

export default Money;
