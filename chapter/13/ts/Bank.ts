import Expression from './Expression';
import Money from './Money';
import Sum from './Sum';
import type { CurrencyTypes } from './constants';

class Bank {
  reduce(source: Expression, to: CurrencyTypes): Money {
    const sum = source as Sum;

    const amount = sum.augend.amount + sum.addend.amount;

    return new Money(amount, to);
  }
}

export default Bank;
