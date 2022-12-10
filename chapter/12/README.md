# Chapter 12 - 드디어, 더하기

**목차**

- [Chapter 12 - 드디어, 더하기](#chapter-12---드디어-더하기)
  - [개요](#개요)
  - [간단한 더하기 연산에 대한 테스트](#간단한-더하기-연산에-대한-테스트)
  - [다중 통화 연산](#다중-통화-연산)
  - [테스트 코드 업데이트](#테스트-코드-업데이트)
  - [Expression 인터페이스](#expression-인터페이스)
  - [Bank 클래스](#bank-클래스)
  - [검토](#검토)

## 개요

기존의 할 일 목록에서 해결했던 항목들을 꽤 많으므로 해결 못한 항목들만 새로운 목록에 적어보자.

- [ ] $5 + 10CHF = $10 (환율이 2:1일 경우)
- [ ] **$5 + $5 = $10**

다른 통화를 가진 두 금액을 더하는 것을 한 번에 구현하기는 쉽지 않아 보인다. 보폭을 줄여 조금 더 간단한 예인 같은 통화를 가진 두 금액을 더하는 것부터 시작해보자.

## 간단한 더하기 연산에 대한 테스트

```javascript
import { Money } from '../js/internal';

test('같은 통화를 가진 두 금액 더하기', () => {
  const sum = Money.dollar(5).plus(Money.dollar(5));
  expect(Money.dollar(10).equals(sum)).toBe(true);
});
```

테스트를 작성했고 실패하는 것을 확인했으니 해당 테스트를 최대한 빨리 통과하게 만들어야 한다.

`Money.dollar(10)`를 반환하는 식으로 `가짜 구현`을 할 수도 있지만 더하기 연산에 대한 구현을 어떻게 해야할지 명확히 보이기 때문에 바로 기능을 구현한다.

```javascript
class Money {
  // ...

  plus(added) {
    return new Money(this.amount + added.amount, this.currency);
  }

  // ...
}
```

테스트를 돌려보면 더하기 연산에 대한 테스트가 잘 통과하는 것을 확인할 수 있다.

## 다중 통화 연산

> _설계상 가장 어려운 제약은 다중 통화 사용에 대한 내용을 시스템의 나머지 코드에게 숨기고 싶다는 것이다._

다중 통화에 대한 개념을 나머지 코드가 알기 시작하면 나머지 코드에서도 다중 통화를 고려해야만 하고 이러면 모든 코드가 서로 얽히고 설키게 된다.

책에서는 다중 통화 사용에 대한 내용을 숨기는 방법으로 내부에서 사용되는 모든 값을 `참조통화`로 전환하는 것을 택한다.  
다만, 이 방법을 사용하면 여러 환율을 쓰기가 어렵다. 따라서, 여러 환율을 표현할 수 있으면서 원하는 바를 이뤄줄 수 있는 객체 .. `객체`를 만들어 사용한다.

> 책을 읽다보면 'TDD는 객체지향 설계를 더 잘하기 위한 방법이 될 수도 있겠구나' 생각이 든다. 책에서 말하는 보폭에 따라 다르겠지만 아래에서부터 위로 단계를 밟아가다보면 자연스레 좋은 객체지향 설계의 방향으로 걸어가게 만들어 주는 것 같다.
>
> 개인적으로 TDD도 Bottom up 방식이라고 느껴진다. 최근 프론트엔드 아키텍처 설계에서 Top down 방식보다는 Bottom up 방식을 택하는 것도 그렇고 무언가를 만듬에 있어서 Bottom up 방식으로 접근하다 보면 Top down 방식으로 접근했을 때보다는 조금 더 단단하고 변경에 유연한 구조가 되는 것 같다.
>
> Bottom up 접근 방식도 그렇고 최근 프론트엔드 아키텍처 설계도 그렇고 어찌 보면 당연한 이야기일 수도 있다.
>
> 얽히고 설킨 거대한 코드 덩어리, 변경하기가 두려운 모놀리식 컴포넌트 .. 이런걸 좋아하는 개발자는 없을 것이다. 예전에도 소 잃고 외양간은 고쳤다. 다만, 이제는 외양간을 만들 때부터 최대한 튼튼하면서 유연한 외양간을 만드는 게 기본이 됐다.

> _TDD는 적절한 때에 번뜩이는 통찰을 보장하지 못한다._  
> _그렇지만 확신을 주는 테스트와 조심스럽게 정리된 코드를 통해, 통찰에 대한 준비와 함께 통찰이 번뜩일 때 그걸 적용할 준비를 할 수 있다._

해법은 `Money`와 비슷하게 동작하지만 사실은 두 `Money`의 합을 나타내는 객체를 만드는 것이다.

여기서 '두 `Money`의 합을 나타내는 객체'를 표현하기 위해 `Expression`이라는 네이밍을 사용한다. 예를 들어, `$2 + 5CHF`를 더한 결과가 `Expression`이 되는 것이다.

`Expression`이라는 것을 통해서 다중 통화에 대한 내용을 숨기고(다중 통화에 대한 내용은 `Expression` 내부에만 존재한다) Expression을 참조통화, 즉 단일 통화로 축약하여 다중 통화의 더하기 연산을 다룰 수 있는 해법을 얻는다.

이를 테스트 코드에 적용하면 아마 마지막 줄은 다음과 같을 것이다.

```javascript
test('같은 통화를 가진 두 금액 더하기', () => {
  // ...

  expect(Money.dollar(10).equals(reduced)).toBe(true);
});
```

여기서 `reduced`는 `Expression`에 환율을 적용하여 단일 통화로 만든 값이다.

실세계에서 환율이 적용되는 곳은 은행이다.

```javascript
test('같은 통화를 가진 두 금액 더하기', () => {
  // ...

  const reduced = bank.reduce(sum, CURRENCY.DOLLAR);
  expect(Money.dollar(10).equals(reduced)).toBe(true);
});
```

위 코드를 보면 알 수 있겠지만 지금 설계상에서 중요한 결정을 내렸다. 여기서 중요한 결정이란 `Bank`에게 `reduce`에 대한 책임을 부여했다는 것이다.

```javascript
const reduced = sum.reduce(CURRENCY.DOLLAR, bank);
```

위와 같이 작성할 수도 있었다. 근데 왜 `Expression`이 아닌 `Bank`에게 `reduce`에 대한 책임을 부여했을까?

1. `Expression`이라는 객체가 다른 부분에 대해서 될 수 있는 한 몰랐으면 좋겠다.

   결국은 객체지향이다. 단일 책임 원칙을 떠올려 보자. `Expression`이라는 핵심 객체가 다른 부분에 대해서 안다는 것은 해당 객체가 고려해야 하는 바가 많아지고 할 일이 늘어나며 이는 더 이상 단일 책임이 아니게 될 것이다.  
   `Expression`이 다른 부분에 대해 몰라야 가능한 오랫 동안 변경에 유연한 객체가 될 수 있을 것이며 테스트하기에도 쉬울 것이다.

2. `Expression`과 관련이 있는 연산이 많을 것이라고 상상할 수 있다.

   모든 연산을 `Expression`에만 추가한다면 `Expression`은 거대한 모놀리식 객체가 되어버릴 것이다.

이유가 충분하지 않을 수도 있지만 지금 당장엔 `Bank`에게 `reduce`에 대한 책임을 부여하기 위한 근거로는 충분하다.  
또한 앞선 Chapter에서도 경험해봤지만 인터페이스에 대한 수정이 발생하지 않는 것이 아니다.  
추후에 근거가 충분해지면 `reduce`에 대한 책임은 `Bank`가 아닌 다른 곳으로 옮겨갈 수도 있을 것이다.

## 테스트 코드 업데이트

`Bank` 인스턴스를 만들어 주자.

```javascript
test('같은 통화를 가진 두 금액 더하기', () => {
  const bank = new Bank();

  const reduced = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(Money.dollar(10).equals(reduced)).toBe(true);
});
```

위에서도 정의했지만 이제 두 금액의 합은 `Expression`이어야 한다.

```javascript
test('같은 통화를 가진 두 금액 더하기', () => {
  const sum = five.plus(five);

  const bank = new Bank();

  const reduced = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(Money.dollar(10).equals(reduced)).toBe(true);
});
```

`$5`에 대한 인스턴스도 만들어 주자.

```javascript
test('같은 통화를 가진 두 금액 더하기', () => {
  const five = Money.dollar(5);

  const sum = five.plus(five);

  const bank = new Bank();

  const reduced = bank.reduce(sum, CURRENCY.DOLLAR);

  expect(Money.dollar(10).equals(reduced)).toBe(true);
});
```

> 이 시점에서 **TypeScript**로 전환했다. 이제부터 **TypeScript**로 책의 예제를 따라간다.

## Expression 인터페이스

`Expression` 인터페이스를 만든다.

```typescript
interface Expression {}
```

두 금액의 합은 `Expression`이라고 표현하기로 했다. 따라서, `Money.plus()`는 `Expression`을 반환해야 한다.

```typescript
class Money {
  // ...

  plus(added: Money): Expression {
    return new Money(this.amount + added.amount, this.currency);
  }

  // ...
}
```

## Bank 클래스

이제 빈 `Bank` 클래스가 필요하다.

```typescript
class Bank {}
```

그리고 `Bank`에 `reduce` 메서드를 `가짜 구현`한다.

```typescript
class Bank {
  reduce(source: Expression, to: string): Money {
    return Money.dollar(10);
  }
}
```

이제 테스트를 돌려보면 통과하는 것을 알 수 있다.  
TDD 사이클의 1번부터 4번까지의 항목을 모두 수행했다. 이제 리팩토링할 준비가 됐다.

## 검토

- 큰 테스트를 작은 테스트($5 + 10CHF에서 $5 + $5로)로 줄여서 발전을 나타낼 수 있도록 했다.
- 우리에게 필요한 계산에 대한 가능한 아이디어들을 신중히 생각해봤다.
- 새 이이디어에 기반하여 기존의 테스트를 재작성했다.
- 테스트를 실행하여 통과되는 것을 확인함으로써 리팩토링을 할 준비를 모두 마쳤다.

  즉, TDD 사이클의 1번부터 4번 항목을 모두 수행했다. 이제 진짜 구현을 만들 시간이다.
