import { Money } from '../js/internal';

test('Franc 곱하기 연산 검증', () => {
  const five = Money.franc(5);

  expect(Money.franc(10).equals(five.times(2))).toBe(true);
  expect(Money.franc(15).equals(five.times(3))).toBe(true);
});
