import Expression from './Expression';
import Money from './Money';
import Bank from './Bank';

import type { CurrencyTypes } from './constants';

class Sum implements Expression {
  augend: Expression;
  addend: Expression;

  constructor(augend: Expression, addend: Expression) {
    this.augend = augend;
    this.addend = addend;
  }

  reduce(bank: Bank, to: CurrencyTypes): Money {
    const amount = this.augend.reduce(bank, to).amount + this.addend.reduce(bank, to).amount;

    return new Money(amount, to);
  }
}

export default Sum;
