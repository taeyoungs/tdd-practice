import { Money } from './internal';

export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }
}
