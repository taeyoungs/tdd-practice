import { Money } from './internal';

export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return Money.franc(super.amount * multiplier);
  }
}
