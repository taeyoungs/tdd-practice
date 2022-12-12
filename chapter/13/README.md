# Chpater 13 - 진짜로 만들기

## 개요

코드 중복은 없지만 데이터 중복이 존재한다.  
Chapter 12에서 빠르게 테스트를 통과시키기 위해서 `가짜 구현`을 진행했었다. 이로 인해 Bank 클래스와 테스트 코드 간에 데이터 중복이 발생한 상황이다.

```typescript
class Bank {
  reduce(source: Expression, to: string): Money {
    return Money.dollar(10); // 가짜 구현으로 만든 $10은
  }
}

test('같은 통화를 가진 두 금액 더하기', () => {
  const five = Money.dollar(5);

  const sum = five.plus(five); // $5와 $5와 같다.

  const bank = new Bank();

  const reduced = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(Money.dollar(10).equals(reduced)).toBe(true);
});
```

이전에는 단순히 상수를 변수로 치환하는 작업이었으니 가짜 구현에서 진짜로 구현으로 거꾸로 작업하는 역방향 작업이 가능했으나 이번엔 어떻게 거꾸로 해야할지 명확하지 않다. 따라서, 순방향으로 작업을 시작한다.

## 두 `Money`의 합은 `Sum`이어야 한다

우선, `Money`의 `plus` 메서드는 단순히 `Money` 클래스의 인스턴스를 반환하는 것이 아니라 Chapter 12에서 설계한 바와 같이 `Expression` 중에서도 `Sum`에 해당하는 `Expression`을 반환해야 한다.

이를 확인하는 테스트 코드를 작성한다.

```typescript
import Money from '../ts/Money';

test('두 Money의 합은 Sum이어야 한다.', () => {
  const five = Money.dollar(5);

  const sum = five.plus(five);

  expect(five.equals(sum.augend)).toBe(true);
  expect(five.equals(sum.addend)).toBe(true);
});
```

> `augend`는 피가산수, 즉 덧셈의 첫 인자다.

테스트를 작성하긴 했지만 이런 테스트는 오래가지 못한다. 위 테스트 코드는 인스턴스의 변수를 직접적으로 참조하는 등 내부 구현에 대해 너무 깊게 관여하고 있다. 앞선 Chapter들을 살펴보면 알 수 있겠지만 이러한 테스트 코드는 결국엔 내부 구현을 숨기기 위해 수정을 하거나 제거한다.

**우리가 테스트해야할 것들은 내부 구현이 아니라 외부 행위다**

하지만 지금 상황에선 이 테스트 코드를 통해 목표에 한 걸음 다가갈 수 있을 것 같으므로 테스트를 통과시키기 위해 움직인다.

이 테스트를 통과시키기 위해선 `augend`와 `addend`라는 멤버 변수를 가진 `Sum` 클래스가 필요하다. 잊지 말자. `Sum`은 `Expression`의 일종이다.

```typescript
class Sum implements Expression {
  augend: Money;
  addend: Money;

  constructor(augend: Money, addend: Money) {
    this.augend = augend;
    this.addend = addend;
  }
}
```

`Money` 클래스의 `plus` 메서드가 `Money` 인스턴스를 반환하고 있다. 이를 `Sum` 클래스의 인스턴스를 반환하도록 수정하자.

```typescript
class Money implements Expression {
  // ...

  plus(added: Money) {
    return new Sum(this, added);
  }

  // ...
}
```

## `Bank.reduce()`

이전 Chapter에서 `Bank`에게 `reduce`에 대한 책임을 위임했고 `reduce`는 `Expression`을 받아 참조통화로 축약시켜주는 메서드였다.

만약 `reduce`가 `Sum`을 전달받았다고 했을 때, `Sum`이 가지고 있는 `Money`의 통화가 모두 동일하고 `reduce` 메서드를 통해 얻어내고자 하는 `Money`의 통화 역시 같다면, `reduce`가 반환하는 값은 `Sum` 내에 있는 `Money`들의 `amount`를 합친 값을 갖는 `Money` 인스턴스여야 한다.

이에 대한 테스트 케이스를 추가하자.

```typescript
test('reduce가 Sum을 전달받았다고 했을 때, Sum이 가지고 있는 Money의 통화가 모두 동일하고 reduce를 통해 얻어내고자 하는 Money의 통화 역시 같다면, reduce가 반환하는 값은 Sum 내에 있는 Money들의 amount를 합친 Money 인스턴스다.', () => {
  const sum = new Sum(Money.dollar(3), Money.dollar(4));

  const bank = new Bank();

  const reduced = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(reduced.equals(Money.dollar(7))).toBe(true);
});
```

기존에 `Bank` 클래스의 `reduce` 메서드를 가짜 구현 해놓았는데 이때 `dollar` 정적 메서드에 넘겨준 값은 10이다. 즉, 위 테스트는 실패할 것이다.

일부로 실패하도록 `amount` 양을 달리 선택한 것도 있지만 이전에 이미 `reduce` 메서드는 `가짜 구현` 해놓았다. 이제 테스트를 통과하게 만들기 위해 기능을 구현해보자.

```typescript
class Bank {
  reduce(source: Expression, to: CurrencyTypes): Money {
    const sum = source as Sum;

    const amount = sum.augend.amount + sum.addend.amount;

    return new Money(amount, to);
  }
}
```

테스트는 통과하지만 `reduce` 메서드는 현재 두 가지 이유로 지저분하다.

1. 캐스팅

   `reduce` 메서드는 `Sum` 뿐만이 아니라 모든 `Expression`에 대해 작동해야 한다.

2. 두 단계에 걸친 참조

   `sum.augend.amount`과 같이 두 단계에 걸쳐서 참조가 일어나고 있다. 이는 가독성에도 좋지 못하다.

우선, 외부에서 접근 가능한 필드 몇 개를 들어내기 위해 메서드 본문을 `Sum` 클래스로 옮긴다.

```typescript
class Sum implements Expression {
  // ...

  reduce(to: CurrencyTypes): Money {
    const amount = this.augend.amount + this.addend.amount;

    return new Money(amount, to);
  }
}

class Bank {
  reduce(source: Expression, to: CurrencyTypes): Money {
    const sum = source as Sum;

    return sum.reduce(to);
  }
}
```

코드르 수정했으므로 테스트를 다시 돌려보자. 테스트는 여전히 잘 통과하고 있다.  
`Bank` 클래스의 `reduce` 메서드에 존재하던 두 단계에 걸친 참조가 `Sum` 클래스의 `reduce` 메서드 내부로 옮겨가면서 위에서 지저분하다고 느꼈던 이유들 중 하나가 사라졌다.

만약 `Bank`의 `reduce` 메서드에 `Expression`이 아닌 `Money`가 들어오면 어떻게 될까?

이에 대한 테스트 케이스를 작성하자.
