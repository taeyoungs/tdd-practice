import { Money, CURRENCY } from './internal';

export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Franc(super.amount * multiplier, super.currency);
  }
}
