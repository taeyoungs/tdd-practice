import Bank from '15/ts/Bank';

import { CURRENCY } from '15/ts/constants';

test('USD에서 USD로의 환율을 요청하면 그 값이 1이 되어야 한다', () => {
  expect(new Bank().rate(CURRENCY.DOLLAR, CURRENCY.DOLLAR)).toBe(1);
});
