# Chapter 16 - 드디어, 추상화

## 개요

> 이전 Chapter에서 Money의 plus 메서드와 times 메서드의 반환 타입을 Expression으로 명시해주면서 plusReturnSum.test.ts와 multiplication.test.ts에서 타입 오류가 발생하기 시작했다. 원인 자체는 반환 타입으로 명시되어 있는 Expression에 Money 클래스의 equals 메서드 내부 로직에서 사용하는 속성들이 존재하지 않기 때문이다. 책이 1부 일정 챕터를 넘어가면서 할 일 목록을 초기화했었는데 이전 테스트들에 대해서는 더 이상 고려하지 않는 것인지 자바와 타입스크립트의 차이인지 정확히는 모르겠다. 자바라 해도 부모 타입으로 정의한 이상 자식 클래스에서만 가지고 있는 멤버 변수를 접근할 수는 없을 것 같은데 .. 🫠

- [x] ~~$5 + 10CHF = $10 (환율이 2:1일 경우)~~
- [x] ~~$5 + $5 = $10~~
- [ ] $5 + $5에서 Money 반환하기
- [x] ~~Bank.reduce(Money)~~
- [x] ~~Money에 대한 통화 변환을 수행하는 Reduce~~
- [x] ~~Reduce(Bank, String)~~
- [ ] Sum.plus
- [ ] Expression.times

이전 Chapter에서 `Expression`에 `plus` 메서드를 추가하고 `Expression`을 구현하고 있는 `Sum` 클래스에 `plus` 메서드를 스텁 구현하고 끝마쳤다. 따라서, 이제 남은 할 일 목록은 스텁 구현되어 있는 `Sum` 클래스의 `plus` 메서드를 완전히 구현하는 것과 `Expression`에 `times` 메서드를 추가하는 것이다.

## Sum.plus()

`Sum` 클래스에 `plus` 메서드를 구현하기 전에 TDD 사이클에 따라 테스트 코드를 먼저 작성하자.

```typescript
test('Sum에 Money를 더할 수 있어야 한다.', () => {
  const fiveBucks = Money.dollar(5);
  const tenFrancs = Money.franc(10);

  const bank = new Bank();
  bank.addRate(CURRENCY.FRANC, CURRENCY.DOLLAR, 2);

  const sum = new Sum(fiveBucks, tenFrancs).plus(fiveBucks);

  const result = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(Money.dollar(15).equals(result)).toBe(true);
});
```

`fiveBucks`와 `tenFancs`를 `plus` 메서드로 더해 `Sum` 인스턴스를 생성할 수도 있지만 생성자 함수를 직접 사용하여 명시적으로 `Sum` 인스턴스를 생성함으로써 현재 테스트 코드에서 테스트하고자 하는 바를 더 잘 드러낼 수 있다.

> 테스트건 글이건 프로그래밍 경험을 더 보람차게 하려고 하는 것만이 아니라 해당 테스트나 글을 보는 사람들을 생각하고 또 생각해야 한다.

이제 스텁 구현으로만 작성되어 있는 `Sum` 클래스의 `plus` 메서드를 완전히 구현해보자.

```typescript
class Sum implements Expression {
  // ...

  plus(addend: Expression): Expression {
    return new Sum(this, addend);
  }
}
```

`Sum` 클래스의 `plus` 메서드 구현이 끝났다. 할 일 목록을 업데이트 하자.

- [x] ~~$5 + 10CHF = $10 (환율이 2:1일 경우)~~
- [x] ~~$5 + $5 = $10~~
- [ ] $5 + $5에서 Money 반환하기
- [x] ~~Bank.reduce(Money)~~
- [x] ~~Money에 대한 통화 변환을 수행하는 Reduce~~
- [x] ~~Reduce(Bank, String)~~
- [x] ~~Sum.plus~~
- [ ] **Expression.times**

> TDD가 경제적이기 위해서는 매일 만들어 내는 코드의 줄 수가 두 배가 되거나 동일한 기능을 구현하되 절반의 줄 수로 해내야 한다.

## Expression.times

`Expression`의 `times` 메서드를 추가하기 위해서는 `Expression`을 구현하고 있는 클래스들이 `plus` 메서드를 구현하고 있어야 한다(이전 Chapter들에서도 그랬듯이 하위 클래스들이 모두 구현을 완료했을 때 안전하게 상위 클래스로 올린다).

현재 `times` 메서드를 가지고 있지 않는 클래스는 `Sum`이다. `Sum` 클래스에 `times` 메서드를 구현하여 돌아가게만 할 수 있다면 `Expression`으로 `times` 메서드를 올릴 수 있을 것이다.

`Sum.times()`에 대한 테스트 케이스부터 작성하자.

```typescript
test('Sum의 times 메서드 검증', () => {
  const fiveBucks = Money.dollar(5);
  const tenFrancs = Money.franc(10);

  const bank = new Bank();
  bank.addRate(CURRENCY.FRANC, CURRENCY.DOLLAR, 2);

  const sum = new Sum(fiveBucks, tenFrancs).times(2);
  const result = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(Money.dollar(20).equals(result)).toBe(true);
});
```

현재 `Sum` 클래스엔 `times` 메서드가 없으므로 테스트는 실패한다. 이제 `times` 메서드를 구현해보자.

```typescript
class Sum implements Expression {
  augend: Expression;
  addend: Expression;

  constructor(augend: Expression, addend: Expression) {
    this.augend = augend;
    this.addend = addend;
  }

  // ...

  times(multiplier: number): Expression {
    return new Sum(this.augend.times(multiplier), this.addend.times(multiplier));
  }
}
```

지난 Chapter에서 피가산수(`augend`)와 가산수(`addend`)의 타입을 `Expression`으로 만들어 줬다. 따라서, 타입 오류를 제거하기 위해서는 `Expression`에 `times` 메서드를 선언해줘야 한다.

```typescript
interface Expression {
  // ...

  times(multiplier: number): Expression;
}
```

이제 테스트가 통과한다. 할 일 목록을 업데이트 하자.

- [x] ~~$5 + 10CHF = $10 (환율이 2:1일 경우)~~
- [x] ~~$5 + $5 = $10~~
- [ ] $5 + $5에서 Money 반환하기
- [x] ~~Bank.reduce(Money)~~
- [x] ~~Money에 대한 통화 변환을 수행하는 Reduce~~
- [x] ~~Reduce(Bank, String)~~
- [x] ~~Sum.plus~~
- [x] ~~Expression.times~~

## 검토

- 미래에 코드를 읽을 다른 사람들을 염두에 둔 테스트를 작성했다.
- 또 한 번 선언부에 대한 수정이 시스템의 나머지 부분으로 번져갔고, 문제를 고치기 위해 타입스크립트의 조언을 따랐다.
