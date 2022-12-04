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
}

export default Money;
