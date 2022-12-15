import type { CurrencyTypes } from './constants';
import Money from './Money';

interface Expression {
  reduce(to: CurrencyTypes): Money;
}

export default Expression;
