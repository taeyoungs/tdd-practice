import { Money } from './internal';

export class Dollar extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Dollar(super.amount * multiplier, super.currency);
  }
}
