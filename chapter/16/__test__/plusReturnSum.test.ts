import Money from '15/ts/Money';

test('두 Money의 합은 Sum이어야 한다.', () => {
  const five = Money.dollar(5);

  const sum = five.plus(five);

  expect(five.equals(sum.augend)).toBe(true);
  expect(five.equals(sum.addend)).toBe(true);
});
