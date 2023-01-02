# Chapter 15 - 서로 다른 통화 더하기

**목차**

- [Chapter 15 - 서로 다른 통화 더하기](#chapter-15---서로-다른-통화-더하기)
  - [개요](#개요)
  - ['서로 다른 통화 더하기'에 대한 테스트 추가하기](#서로-다른-통화-더하기에-대한-테스트-추가하기)
    - [Sum 클래스 수정](#sum-클래스-수정)
    - [Money 클래스 수정](#money-클래스-수정)
    - [Expression 업데이트로 인한 수정사항 반영](#expression-업데이트로-인한-수정사항-반영)
  - [검토](#검토)

## 개요

- **[ ] $5 + 10CHF = $10** (**환율이 2:1일 경우**)
- [x] ~~$5 + $5 = $10~~
- [ ] $5 + $5에서 Money 반환하기
- [x] ~~Bank.reduce(Money)~~
- [x] ~~Money에 대한 통화 변환을 수행하는 Reduce~~
- [x] ~~Reduce(Bank, String)~~

할 일 목록에 존재했던 다양한 항목들을 해결함으로써 드디어 행했던 작업들의 시초인 '서로 다른 통화 더하기'에 대한 테스트를 추가할 준비가 됐다.

## '서로 다른 통화 더하기'에 대한 테스트 추가하기

```typescript
test('서로 다른 통화 더하기 검증', () => {
  const fiveBucks = Money.dollar(5);
  const tenFrancs = Money.franc(10);

  // * Franc -> Dollar에 대한 환율 정보를 입력한다.
  const bank = new Bank();
  bank.addRate(CURRENCY.FRANC, CURRENCY.DOLLAR, 2);

  // * 서로 다른 통화를 더하고 이를 Dollar로 축약한다.
  const result = bank.reduce(fiveBucks.plus(tenFrancs), CURRENCY.DOLLAR);

  // * 앞서 입력했던 환율 정보에 따르면 10 Franc은 5 Dollar, 즉 10 Dollar가 되어야 한다.
  expect(Money.dollar(10).equals(result)).toBe(true);
});
```

테스트는 실패한다. `result` 객체의 `amount`를 찍어보면 **15**가 나오는 것을 확인할 수 있다. 이말인 즉슨 `reduce` 메서드를 통한 축약이 제대로 이루어지지 않았다는 뜻이다.  
방금은 더하기 연산을 진행했기 때문에 정확히는 `Sum`의 `reduce`가 일을 제대로 하지 못했다.  
`Sum`의 `reduce` 메서드를 한번 살펴보자.

### Sum 클래스 수정

```typescript
class Sum implements Expression {
  augend: Money;
  addend: Money;

  constructor(augend: Money, addend: Money) {
    this.augend = augend;
    this.addend = addend;
  }

  reduce(_bank: Bank, to: CurrencyTypes): Money {
    const amount = this.augend.amount + this.addend.amount;

    return new Money(amount, to);
  }
}
```

위 `Sum.reduce`를 보면 단순히 `amount`를 더해 해당 `amount`를 갖는 새로운 `Money` 인스턴스를 반환하고만 있다. 축약이 제대로 되지 않는 것은 당연하다.  
테스트를 통과하기 위해서 `Sum.reduce`를 수정해보자.

```typescript
class Sum implements Expression {
  augend: Money;
  addend: Money;

  constructor(augend: Money, addend: Money) {
    this.augend = augend;
    this.addend = addend;
  }

  reduce(bank: Bank, to: CurrencyTypes): Money {
    const amount = this.augend.reduce(bank, to).amount + this.addend.reduce(bank, to).amount;

    return new Money(amount, to);
  }
}
```

앞선 Chapter의 `Bank` 클래스를 수정할 때와 동일하게 피가산수(`augend`)와 가산수(`addend`)도 `Expression`이어야 한다.  
side effect를 최소화하기 위해 가장자리부터 작업하여 테스트 케이스까지 올라가 보도록 하자.

`Expression`은 `reduce` 메서드를 가지고 있다. 따라서, 피가산수(`augend`), 가산수(`addend`) 그리고 생성자 함수 매개변수를 `Expression`으로 바꿀 수 있다.

```typescript
class Sum implements Expression {
  augend: Expression;
  addend: Expression;

  constructor(augend: Expression, addend: Expression) {
    this.augend = augend;
    this.addend = addend;
  }

  reduce(bank: Bank, to: CurrencyTypes): Money {
    const amount = this.augend.reduce(bank, to).amount + this.addend.reduce(bank, to).amount;

    return new Money(amount, to);
  }
}
```

### Money 클래스 수정

`Money` 클래스는 어떨까?  
가산수를 취급하는 `plus` 메서드의 인자를 `Expression`으로 취급할 수 있으며 앞선 Chapter를 통해 연산의 결과값을 `Expression`이라고 표현하기로 했으니 `plus` 메서드와 `times` 메서드의 반환값을 `Expression`이라 할 수도 있다.

```typescript
class Money implements Expression {
  // ...

  times(multiplier: number): Expression {
    return new Money(this.amount * multiplier, this.currency);
  }

  plus(addend: Expression): Expression {
    return new Sum(this, addend);
  }

  // ...
}
```

이 두 메서드는 `Expression`이 `times`와 `plus`를 포함해야 한다는 것을 시사한다.

이를 인지하고 테스트 코드를 다음과 같이 수정해보자.

```typescript
test('서로 다른 통화 더하기 검증', () => {
  const fiveBucks: Expression = Money.dollar(5);
  const tenFrancs: Expression = Money.franc(10);

  // * Franc -> Dollar에 대한 환율 정보를 입력한다.
  const bank = new Bank();
  bank.addRate(CURRENCY.FRANC, CURRENCY.DOLLAR, 2);

  // * 서로 다른 통화를 더하고 이를 Dollar로 축약한다.
  const result = bank.reduce(fiveBucks.plus(tenFrancs), CURRENCY.DOLLAR);

  // * 앞서 입력했던 환율 정보에 따르면 10 Franc은 5 Dollar, 즉 10 Dollar가 되어야 한다.
  expect(Money.dollar(10).equals(result)).toBe(true);
});
```

`fiveBucks`와 `tenFrancs`를 `Expression`으로 타입을 덮어주었다. 바로 타입스크립트 컴파일러에서 `Expression`인 `fiveBucks`에겐 `plus` 메서드는 없다고 바로 알려주고 있다(실제로는 `Money` 클래스의 인스턴스가 `fiveBucks`에 할당될테니 코드 자체는 문제없이 돌아간다).  
컴파일 에러를 해결해주기 위해 `Expression`에 `plus` 메서드를 구현해주자.

```typescript
interface Expression {
  reduce(bank: Bank, to: CurrencyTypes): Money;

  plus(addend: Expression): Expression;
}
```

### Expression 업데이트로 인한 수정사항 반영

`Expression`에 `plus` 메서드가 추가되었다. 이는 `Expression`을 구현하고 있는 모든 클래스가 `plus` 메서드를 구현해야 함을 의미한다.

> 몰랐는데 책에선 지금까지 Money의 plus 메서드가 private 메서드였다.. 책에서는 이때서야 public 메서드로 전환하지만 내가 구현했던 것은 계속 public 메서드였으니 그대로 진행하자.

`Expression`을 구현하고 있는 `Money`와 `Sum`이 `plus` 메서드를 가져야 하기에 `Sum` 클래스에 `plus` 구현하자. 단, 구현 자체는 스텁 구현으로 진행하고 할 일 목록을 업데이트하자.

```typescript
class Sum implements Expression {
  // ...

  plus(_addend: Expression): Expression {
    return this;
  }
}
```

- [x] ~~$5 + 10CHF = $10 (환율이 2:1일 경우)~~
- [x] ~~$5 + $5 = $10~~
- [ ] $5 + $5에서 Money 반환하기
- [x] ~~Bank.reduce(Money)~~
- [x] ~~Money에 대한 통화 변환을 수행하는 Reduce~~
- [x] ~~Reduce(Bank, String)~~
- [ ] Sum.plus
- [ ] Expression.times

## 검토

- 좀 더 추상적인 선언을 통해 가지에서 뿌리로 일반환했다.
- 변경 후 (fiveBucks를 Expression 타입으로 변경), 그 영향을 받은 다른 부분들을 변경하기 위해 컴파일러(타입스크립트)의 지시를 따랐다(Expression에 plus 메서드 추가 등).
