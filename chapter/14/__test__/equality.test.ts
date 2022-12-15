import Money from '../ts/Money';

test('동일한 화폐를 사용하는 Money는 금액이 동일할 경우 같아야 한다.', () => {
  expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
  expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
  expect(Money.dollar(5).equals(Money.franc(6))).toBe(false);
});
