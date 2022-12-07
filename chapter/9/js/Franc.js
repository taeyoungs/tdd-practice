import { Money, CURRENCY } from './internal';

export class Franc extends Money {
  constructor(amount) {
    super(amount);
  }

  times(multiplier) {
    return new Franc(super.amount * multiplier);
  }

  currency() {
    return CURRENCY.FRANC;
  }
}
