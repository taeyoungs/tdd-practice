import { Money, CURRENCY } from './internal';

export class Dollar extends Money {
  #currency;

  constructor(amount, currency) {
    super(amount);
    this.#currency = CURRENCY.DOLLAR;
  }

  times(multiplier) {
    return Money.dollar(super.amount * multiplier);
  }

  currency() {
    return this.#currency;
  }
}
