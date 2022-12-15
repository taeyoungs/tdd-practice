import Expression from './Expression';
import Money from './Money';

import { CURRENCY } from './constants';
import type { CurrencyTypes } from './constants';

class Bank {
  reduce(source: Expression, to: CurrencyTypes): Money {
    return source.reduce(this, to);
  }

  rate(from: CurrencyTypes, to: CurrencyTypes) {
    return from === CURRENCY.FRANC && to === CURRENCY.DOLLAR ? 2 : 1;
  }
}

export default Bank;
