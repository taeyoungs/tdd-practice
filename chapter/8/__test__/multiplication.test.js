import Money from '../js/Money';

test('Dollar 곱하기 연산 검증', () => {
  const five = Money.dollar(5);

  expect(Money.dollar(10).equals(five.times(2))).toBe(true);
  expect(Money.dollar(15).equals(five.times(3))).toBe(true);
});
