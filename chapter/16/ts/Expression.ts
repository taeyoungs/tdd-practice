import Bank from './Bank';
import Money from './Money';
import type { CurrencyTypes } from './constants';

interface Expression {
  reduce(bank: Bank, to: CurrencyTypes): Money;

  plus(addend: Expression): Expression;

  times(multiplier: number): Expression;
}

export default Expression;
