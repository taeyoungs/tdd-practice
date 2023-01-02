import Bank from '15/ts/Bank';
import Money from '15/ts/Money';

import { CURRENCY } from '15/ts/constants';

describe('Bank의 reduce 연산 검증', () => {
  test('Bank의 reduce에 Money가 들어올 경우', () => {
    const bank = new Bank();

    const result = bank.reduce(Money.dollar(1), CURRENCY.DOLLAR);

    expect(Money.dollar(1).equals(result)).toBe(true);
  });

  test('Bank에 환율 정보가 존재하지 않을 경우', () => {
    const bank = new Bank();

    expect(() => bank.reduce(Money.dollar(5), CURRENCY.FRANC)).toThrow(new ReferenceError('Rate does not exist'));
  });
});
