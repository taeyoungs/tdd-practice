import Money from './Money';

class Dollar extends Money {
  constructor(amount) {
    super(amount);
  }

  times(multiplier) {
    return new Dollar(super.amount * multiplier);
  }

  equals(instance) {
    return super.amount === instance.amount;
  }
}

export default Dollar;
