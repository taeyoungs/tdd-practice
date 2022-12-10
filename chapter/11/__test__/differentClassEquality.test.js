import { Money, Franc, CURRENCY } from '../js/internal';

test("Franc(10, 'CHF')와 Money(10, 'USD')는 같아야 한다.", () => {
  expect(new Money(10, CURRENCY.FRANC).equals(new Franc(10, CURRENCY.FRANC))).toBe(true);
});
