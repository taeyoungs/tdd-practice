class Dollar {
  amount;

  constructor(amount) {
    this.amount = amount;
  }

  times(multiplier) {
    return new Dollar(this.amount * multiplier);
  }

  equals(instance) {
    return this.amount === instance.amount;
  }
}

export default Dollar;
