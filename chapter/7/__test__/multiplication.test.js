import Dollar from '../js/Dollar.js';

test('Dollar 곱하기 연산 검증', () => {
  const five = new Dollar(5);

  expect(new Dollar(10).equals(five.times(2))).toBe(true);
  expect(new Dollar(15).equals(five.times(3))).toBe(true);
});
