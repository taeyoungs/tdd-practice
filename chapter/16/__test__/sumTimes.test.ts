import Bank from '16/ts/Bank';
import { CURRENCY } from '16/ts/constants';
import Money from '16/ts/Money';
import Sum from '16/ts/Sum';

test('Sum의 times 메서드 검증', () => {
  const fiveBucks = Money.dollar(5);
  const tenFrancs = Money.franc(10);

  const bank = new Bank();
  bank.addRate(CURRENCY.FRANC, CURRENCY.DOLLAR, 2);

  const sum = new Sum(fiveBucks, tenFrancs).times(2);
  const result = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(Money.dollar(20).equals(result)).toBe(true);
});
