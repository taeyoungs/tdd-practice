import { Money } from './internal';

export class Dollar extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return Money.dollar(super.amount * multiplier);
  }

  currency() {
    return super.currency;
  }
}
