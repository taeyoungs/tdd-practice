import Expression from './Expression';
import Bank from './Bank';
import Sum from './Sum';

import { CURRENCY } from './constants';
import type { CurrencyTypes } from './constants';

class Money implements Expression {
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

  times(multiplier: number): Expression {
    return new Money(this.amount * multiplier, this.currency);
  }

  plus(addend: Expression): Expression {
    return new Sum(this, addend);
  }

  reduce(bank: Bank, to: CurrencyTypes): Money {
    const rate = bank.rate(this.currency, to);

    return new Money(this.amount / rate, to);
  }

  static dollar(amount: number) {
    return new Money(amount, CURRENCY.DOLLAR);
  }

  static franc(amount: number) {
    return new Money(amount, CURRENCY.FRANC);
  }
}

export default Money;
