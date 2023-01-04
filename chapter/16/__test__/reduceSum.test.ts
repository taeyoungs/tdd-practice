import Bank from '15/ts/Bank';
import Money from '15/ts/Money';
import Sum from '15/ts/Sum';

import { CURRENCY } from '15/ts/constants';

test('reduce가 Sum을 전달받았다고 했을 때, Sum이 가지고 있는 Money의 통화가 모두 동일하고 reduce를 통해 얻어내고자 하는 Money의 통화 역시 같다면, reduce가 반환하는 값은 Sum 내에 있는 Money들의 amount를 합친 Money 인스턴스다.', () => {
  const sum = new Sum(Money.dollar(3), Money.dollar(4));

  const bank = new Bank();

  const reduced = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(reduced.equals(Money.dollar(7))).toBe(true);
});
