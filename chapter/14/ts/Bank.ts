import Expression from './Expression';
import Money from './Money';
import type { CurrencyTypes } from './constants';

class Bank {
  reduce(source: Expression, to: CurrencyTypes): Money {
    return source.reduce(this, to);
  }
}

export default Bank;
