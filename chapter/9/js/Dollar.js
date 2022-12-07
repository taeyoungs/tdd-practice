import { Money } from './internal';

export class Dollar extends Money {
  #currency;

  constructor(amount, currency) {
    super(amount);
    this.#currency = currency;
  }

  times(multiplier) {
    return Money.dollar(super.amount * multiplier);
  }

  currency() {
    return this.#currency;
  }
}
