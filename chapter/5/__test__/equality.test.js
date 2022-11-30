import Dollar from '../js/Dollar';

test('생성자 함수 인자에 동일한 값을 전달한 Dollar 인스턴스는 같아야 한다.', () => {
  expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
  expect(new Dollar(5).equals(new Dollar(6))).toBe(false);
});
