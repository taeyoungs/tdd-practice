import Bank from '15/ts/Bank';
import Money from '15/ts/Money';

import { CURRENCY } from '15/ts/constants';

test('Bank의 reduce에 Money가 들어올 경우에 대한 검증', () => {
  const bank = new Bank();

  const result = bank.reduce(Money.dollar(1), CURRENCY.DOLLAR);

  expect(Money.dollar(1).equals(result)).toBe(true);
});
