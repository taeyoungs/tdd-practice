import Bank from '15/ts/Bank';
import Money from '15/ts/Money';

import { CURRENCY } from '15/ts/constants';

test('같은 통화를 가진 두 금액 더하기', () => {
  const five = Money.dollar(5);

  const sum = five.plus(five);

  const bank = new Bank();

  const reduced = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(Money.dollar(10).equals(reduced)).toBe(true);
});
