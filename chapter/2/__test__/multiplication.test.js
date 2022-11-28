import Dollar from '../js/Dollar.js';

test('어떤 금액(주가)을 어떤 수(주식의 수)에 곱한 금액을 결과로 얻을 수 있어야 한다.', () => {
  const five = new Dollar(5);
  five.times(2);

  expect(five.amount).toBe(10);
});
