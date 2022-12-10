import { CURRENCY } from '../js/constants';
import { Money } from '../js/Money';

test('통화(currency) 테스트', () => {
  expect(Money.dollar(1).currency).toBe(CURRENCY.DOLLAR);
  expect(Money.franc(1).currency).toBe(CURRENCY.FRANC);
});
