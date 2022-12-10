import { CURRENCY } from './internal';

export class Money {
  #amount;
  #currency;

  constructor(amount, currency) {
    this.#amount = amount;
    this.#currency = currency;
  }

  get amount() {
    return this.#amount;
  }

  get currency() {
    return this.#currency;
  }

  equals(instance) {
    const isSameCurrency = this.currency === instance.currency;

    return this.amount === instance.amount && isSameCurrency;
  }

  times(multiplier) {
    return new Money(this.amount * multiplier, this.currency);
  }

  plus(added) {
    return new Money(this.amount + added.amount, this.currency);
  }

  static dollar(amount) {
    return new Money(amount, CURRENCY.DOLLAR);
  }

  static franc(amount) {
    return new Money(amount, CURRENCY.FRANC);
  }
}
