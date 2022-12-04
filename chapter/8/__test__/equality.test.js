import { Money } from '../js/internal';

test('생성자 함수 인자에 동일한 값을 전달한 인스턴스는 같아야 한다. 단, 클래스도 동일해야 한다', () => {
  expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
  expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
  expect(Money.franc(5).equals(Money.franc(5))).toBe(true);
  expect(Money.franc(5).equals(Money.franc(6))).toBe(false);
  expect(Money.dollar(5).equals(Money.franc(6))).toBe(false);
});
