import { CURRENCY, CurrencyTypes } from './constants';
import Expression from './Expression';

export class Money {
  #amount: number;
  #currency: CurrencyTypes;

  constructor(amount: number, currency: CurrencyTypes) {
    this.#amount = amount;
    this.#currency = currency;
  }

  get amount() {
    return this.#amount;
  }

  get currency() {
    return this.#currency;
  }

  equals(instance: Money) {
    const isSameCurrency = this.currency === instance.currency;

    return this.amount === instance.amount && isSameCurrency;
  }

  times(multiplier: number) {
    return new Money(this.amount * multiplier, this.currency);
  }

  plus(added: Money): Expression {
    return new Money(this.amount + added.amount, this.currency);
  }

  static dollar(amount: number) {
    return new Money(amount, CURRENCY.DOLLAR);
  }

  static franc(amount: number) {
    return new Money(amount, CURRENCY.FRANC);
  }
}
