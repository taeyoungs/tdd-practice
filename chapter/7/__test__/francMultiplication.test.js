import Franc from '../js/Franc';

test('Franc 곱하기 연산 검증', () => {
  const five = new Franc(5);

  expect(new Franc(10).equals(five.times(2))).toBe(true);
  expect(new Franc(15).equals(five.times(3))).toBe(true);
});
