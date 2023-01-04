import Money from '16/ts/Money';
import Bank from '16/ts/Bank';
import Sum from '16/ts/Sum';

import { CURRENCY } from '16/ts/constants';

test('Sum에 Money를 더할 수 있어야 한다.', () => {
  const fiveBucks = Money.dollar(5);
  const tenFrancs = Money.franc(10);

  const bank = new Bank();
  bank.addRate(CURRENCY.FRANC, CURRENCY.DOLLAR, 2);

  const sum = new Sum(fiveBucks, tenFrancs).plus(fiveBucks);

  const result = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(Money.dollar(15).equals(result)).toBe(true);
});
