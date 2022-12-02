class Franc {
  #amount;

  constructor(amount) {
    this.#amount = amount;
  }

  get amount() {
    return this.#amount;
  }

  times(multiplier) {
    return new Franc(this.#amount * multiplier);
  }

  equals(instance) {
    return this.#amount === instance.amount;
  }
}

export default Franc;
