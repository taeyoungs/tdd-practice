import Money from '15/ts/Money';

import { CURRENCY } from '15/ts/constants';

test('통화(currency) 테스트', () => {
  expect(Money.dollar(1).currency).toBe(CURRENCY.DOLLAR);
  expect(Money.franc(1).currency).toBe(CURRENCY.FRANC);
});
