import Expression from './Expression';
import Money from './Money';
import Bank from './Bank';

import type { CurrencyTypes } from './constants';

class Sum implements Expression {
  augend: Money;
  addend: Money;

  constructor(augend: Money, addend: Money) {
    this.augend = augend;
    this.addend = addend;
  }

  reduce(_bank: Bank, to: CurrencyTypes): Money {
    const amount = this.augend.amount + this.addend.amount;

    return new Money(amount, to);
  }
}

export default Sum;
