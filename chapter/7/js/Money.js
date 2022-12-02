class Money {
  #amount;

  constructor(amount) {
    this.#amount = amount;
  }

  get amount() {
    return this.#amount;
  }

  equals(instance) {
    return this.amount === instance.amount;
  }
}

export default Money;
