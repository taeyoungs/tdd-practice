import Money from './Money';

class Franc extends Money {
  constructor(amount) {
    super(amount);
  }

  times(multiplier) {
    return new Franc(super.amount * multiplier);
  }
}

export default Franc;
