import { Money } from '../js/internal';

test('같은 통화를 가진 두 금액 더하기', () => {
  const sum = Money.dollar(5).plus(Money.dollar(5));
  expect(Money.dollar(10).equals(sum)).toBe(true);
});
