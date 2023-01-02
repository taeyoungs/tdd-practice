import Bank from '15/ts/Bank';
import Money from '15/ts/Money';

import { CURRENCY } from '15/ts/constants';
import Expression from '15/ts/Expression';

test('서로 다른 통화 더하기 검증', () => {
  const fiveBucks: Expression = Money.dollar(5);
  const tenFrancs: Expression = Money.franc(10);

  // * Franc -> Dollar에 대한 환율 정보를 입력한다.
  const bank = new Bank();
  bank.addRate(CURRENCY.FRANC, CURRENCY.DOLLAR, 2);

  // * 서로 다른 통화를 더하고 이를 Dollar로 축약한다.
  const result = bank.reduce(fiveBucks.plus(tenFrancs), CURRENCY.DOLLAR);

  // * 앞서 입력했던 환율 정보에 따르면 10 Franc은 5 Dollar, 즉 10 Dollar가 되어야 한다.
  expect(Money.dollar(10).equals(result)).toBe(true);
});
