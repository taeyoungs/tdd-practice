import Bank from '15/ts/Bank';
import Money from '15/ts/Money';

import { CURRENCY } from '15/ts/constants';

test('2프랑을 달러로 바꾸는 연산에 대한 검증', () => {
  const bank = new Bank();
  bank.addRate(CURRENCY.FRANC, CURRENCY.DOLLAR, 2);

  const result = bank.reduce(Money.franc(2), CURRENCY.DOLLAR);
  expect(result.equals(Money.dollar(1))).toBe(true);
});
