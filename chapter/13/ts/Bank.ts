import Expression from './Expression';
import Money from './Money';
import Sum from './Sum';
import type { CurrencyTypes } from './constants';

class Bank {
  reduce(source: Expression, to: CurrencyTypes): Money {
    const sum = source as Sum;

    return sum.reduce(to);
  }
}

export default Bank;
