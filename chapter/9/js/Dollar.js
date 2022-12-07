import { Money, CURRENCY } from './internal';

export class Dollar extends Money {
  constructor(amount) {
    super(amount);
  }

  times(multiplier) {
    return new Dollar(super.amount * multiplier);
  }

  currency() {
    return CURRENCY.DOLLAR;
  }
}
