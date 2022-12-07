import { Money, CURRENCY } from './internal';

export class Franc extends Money {
  #currency;

  constructor(amount, currency) {
    super(amount);
    this.#currency = CURRENCY.FRANC;
  }

  times(multiplier) {
    return new Franc(super.amount * multiplier);
  }

  currency() {
    return this.#currency;
  }
}
