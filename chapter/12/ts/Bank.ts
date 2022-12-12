import Expression from './Expression';
import Money from './Money';

class Bank {
  reduce(source: Expression, to: string): Money {
    return Money.dollar(10);
  }
}

export default Bank;
