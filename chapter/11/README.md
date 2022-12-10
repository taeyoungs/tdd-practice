# Chapter 11 - 모든 악의 근원

## 개요

- [ ] $5 + 10CHF = $10 (환율이 2:1일 경우)
- [x] ~~$5 x 2 = $10~~
- [x] ~~`amount`를 `private`으로 만들기~~
- [x] ~~`Dollar` 부작용 ?~~
- [ ] `Money` 반올림 ?
- [x] ~~equals()~~
- [ ] hashCode()
- [ ] Equal null
- [ ] Equal object
- [x] ~~5CHF x 2 = 10CHF~~
- [ ] **Dollar/Franc 중복**
- [x] ~~공용 equals~~
- [x] ~~공용 times~~
- [x] ~~Franc와 Dollar 비교하기~~
- [x] ~~통화?~~
- [ ] `francMultiplication.test.js`를 지워야 할까?

두 하위 클래스 `Dollar`와 `Franc`을 살펴보면 클래스 몸체에 생성자 밖에 남지 않을 것을 확인할 수 있다. 단지 생성자 때문에 하위 클래스가 있을 필요는 없기 때문에 드디어 하위 클래스를 제거해도 문제가 없을 것 같다.

```javascript
export class Dollar extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }
}

export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }
}
```

## `dollar`, `franc` 메서드 수정

하위 클래스에 생성자 밖에 없으므로 코드의 의미를 변경하지 않으면서도 하위 클래스에 대한 참조를 상위 클래스에 대한 참조로 변경할 수 있다.

`Money` 클래스의 `franc`과 `dollar` 메서드를 고쳐보자.

```javascript
export class Money {
  //...

  static dollar(amount) {
    return new Money(amount, CURRENCY.DOLLAR);
  }

  static franc(amount) {
    return new Money(amount, CURRENCY.FRANC);
  }
}
```

테스트를 돌려보면 여전히 통과하고 있다.

`dollar` 메서드를 고치게 된 순간 `Dollar` 클래스를 직접적으로 참조하는 곳은 하나도 남아 있지 않게 된다. 따라서, `Dollar` 클래스를 지워도 상관없다.  
이에 반해 `Franc` 클래스는 Chapter 10에서 작성했던 `differentClassEquality.test.js`에서 아직 참조되고 있다.

```javascript
// differentClassEquality.test.js
test("Franc(10, 'CHF')와 Money(10, 'USD')는 같아야 한다.", () => {
  expect(new Money(10, CURRENCY.FRANC).equals(new Franc(10, CURRENCY.FRANC))).toBe(true);
});
```

`Franc` 클래스에 대한 직접적인 참조를 제거하려면 이 테스트를 지워도 될 정도로 다른 곳에서 동치성 테스트를 충분히 진행하고 있는지 알아야 한다.

## 동치성 테스트 업데이트

```javascript
test('동일한 화폐를 사용하는 Money는 금액이 동일할 경우 같아야 한다.', () => {
  expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
  expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
  expect(Money.franc(5).equals(Money.franc(5))).toBe(true);
  expect(Money.franc(5).equals(Money.franc(6))).toBe(false);
  expect(Money.dollar(5).equals(Money.franc(6))).toBe(false);
});
```

`equality.test.js`를 확인해보니 동치성 테스트를 충분히 진행하고 있는 것 같다. 다만, `Dollar`와 `Franc`이라는 하위 클래스가 사라지고 `currency` 개념을 이용해서 비교를 하기 때문에 세 번째와 네 번째 테스트는 이제는 첫 번째 그리고 두 번째 테스트와 중복이 되어버린다.  
따라서, 이 부분은 제거해주자.

```javascript
test('동일한 화폐를 사용하는 Money는 금액이 동일할 경우 같아야 한다.', () => {
  expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
  expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
  expect(Money.dollar(5).equals(Money.franc(6))).toBe(false);
});
```

## 불필요해진 테스트 삭제

클래스 대신 `currency`를 비교하도록 하는 테스트 코드는 하위 클래스가 존재할 때 의미가 있다. `Franc` 클래스를 비롯한 하위 클래스를 제거하는 중이기 때문에 `Franc` 클래스가 있을 경우에 대한 동치성 테스트는 도움이 되지 않는다. 따라서, 하위 클래스 제거와 함께 테스트(`differentCalssEquality.test.js`)도 삭제한다.

관련 코드를 모두 삭제한 뒤 테스트를 돌려보자. 여전히 잘 통과하고 있다.

할 일 목록을 다시 확인해보자.

- [ ] $5 + 10CHF = $10 (환율이 2:1일 경우)
- [x] ~~$5 x 2 = $10~~
- [x] ~~`amount`를 `private`으로 만들기~~
- [x] ~~`Dollar` 부작용 ?~~
- [ ] `Money` 반올림 ?
- [x] ~~equals()~~
- [ ] hashCode()
- [ ] Equal null
- [ ] Equal object
- [x] ~~5CHF x 2 = 10CHF~~
- [x] ~~Dollar/Franc 중복~~
- [x] ~~공용 equals~~
- [x] ~~공용 times~~
- [x] ~~Franc와 Dollar 비교하기~~
- [x] ~~통화?~~
- [ ] **`francMultiplication.test.js`를 지워야 할까?**

하위 클래스들을 모두 제거했고 `times` 메서드도 화폐에 관계없이 동일한 로직을 사용하도록 만들었다. 그렇다는 것은 `francMultiplication.test.js`는 더 이상 `multiplication.test.js` 테스트와 다른 무언가를 테스트하는 코드가 아니다. 하위 클래스들이 존재할 때는 차이가 있었지만 하위 클래스들이 없어진 지금은 그렇지 않다. 따라서, `francMultiplication.test.js`도 없애주자.

## 검토

- 하위 클래스의 속을 들어내는 것을 완료하고, 하위 클래스를 삭제했다.
- 기존의 소스 구조에서는 필요했지만 새로운 구조에서는 필요 없게 된 테스트를 제거했다.
