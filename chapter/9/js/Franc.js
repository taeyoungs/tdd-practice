import { Money } from './internal';

export class Franc extends Money {
  #currency;

  constructor(amount, currency) {
    super(amount);
    this.#currency = currency;
  }

  times(multiplier) {
    return Money.franc(super.amount * multiplier);
  }

  currency() {
    return this.#currency;
  }
}
