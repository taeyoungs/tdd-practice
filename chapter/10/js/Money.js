import { Dollar, Franc, CURRENCY } from './internal';

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

  static dollar(amount) {
    return new Dollar(amount, CURRENCY.DOLLAR);
  }

  static franc(amount) {
    return new Franc(amount, CURRENCY.FRANC);
  }
}
