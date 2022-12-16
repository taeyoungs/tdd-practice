# Chapter 14 - 바꾸기

**목차**

- [Chapter 14 - 바꾸기](#chapter-14---바꾸기)
  - [개요](#개요)
  - [프랑을 달러로 바꾸는 연산](#프랑을-달러로-바꾸는-연산)
  - [상수값 `2` 제거하기](#상수값-2-제거하기)
  - [환율표](#환율표)
  - [검토](#검토)

## 개요

- [ ] $5 + 10CHF = $10 (환율이 2:1일 경우)
- [ ] $5 + $5 = $10
- [ ] $5 + $5에서 Money 반환하기
- [x] ~~Bank.reduce(Money)~~
- [ ] **Money에 대한 통화 변환을 수행하는 Reduce**
- [ ] Reduce(Bank, String)

이번에는 좀 단순한 변화, 2프랑을 달러로 바꾸는 걸 해보려고 한다.

말만 적었을 뿐인데 테스트 케이스가 만들어진 것 같다. 이것을 바로 테스트 코드로 작성해보자.

## 프랑을 달러로 바꾸는 연산

```typescript
test('2프랑을 달러로 바꾸는 연산에 대한 검증', () => {
  const bank = new Bank();
  bank.addRate(CURRENCY.FRANC, CURRENCY.DOLLAR, 2);

  const result = bank.reduce(Money.franc(2), CURRENCY.DOLLAR);
  expect(result.equals(Money.dollar(1))).toBe(true);
});
```

> 프랑을 달러로 변환하기 위해 프랑을 2로 나누고 있다. 12월 15일 기준으로 1프랑은 1.08달러이긴 하지만 여기선 "프랑을 달러로 변환하기 위해 어떤 연산(나누기 2)을 해준다"에 초점을 맞추자.

생각했던 테스트 케이스를 만들었고 실패하는 것도 확인했다. 이제 테스트를 통과하게 만들 차례다.  
다음과 같은 지저분한 코드를 통해 우선 테스트를 통과하게 만들 수 있다.

```typescript
class Money implements Expression {
  // ...

  reduce(to: CurrencyTypes): Money {
    const rate = this.currency === CURRENCY.FRANC && to === CURRENCY.DOLLAR ? 2 : 1;

    return new Money(this.amount / rate, to);
  }

  // ...
}
```

> 책에서 테스트가 통과되어 초록 막대를 볼 수 있다라고 나오는데 `addRate` 메서드의 구현을 제외한 상황인건지 뭔지 모르겠다. 우선 `addRate` 메서드 구현에 대한 오류는 제외하고 진행하도록 한다.

테스트가 통과하긴 하지만 문제가 생겼다.

바로 `Money`가 환율이라는 정보를 알게 됐다. 앞선 Chapter에서도 나왔었지만 기능들이 서로에 대해 알게 되면 엃히고 설키며 서로 간에 의존성을 갖게 된다. 이는 좋지 못하다.  
환율과 관련된 작업은 `Bank`가 하도록 만들어야 한다.

`Expression`과 관련된 객체들에서 환율과 관련된 작업을 `Bank`가 하도록 만들려면 `Expression.bank()`에 `Bank`를 인자로 넘겨줘야 한다.

우선, 호출부부터 수정하자.

```typescript
class Bank {
  reduce(source: Expression, to: CurrencyTypes): Money {
    return source.reduce(this, to);
  }
}
```

호출부를 수정했으니 구현부도 수정해주자.

```typescript
interface Expression {
  reduce(bank: Bank, to: CurrencyTypes): Money;
}

class Money implements Expression {
  // ...

  reduce(bank: Bank, to: CurrencyTypes): Money {
    const rate = this.currency === CURRENCY.FRANC && to === CURRENCY.DOLLAR ? 2 : 1;

    return new Money(this.amount / rate, to);
  }

  // ...
}

class Sum implements Expression {
  // ...

  reduce(bank: Bank, to: CurrencyTypes): Money {
    const amount = this.augend.amount + this.addend.amount;

    return new Money(amount, to);
  }
}
```

인터페이스에 선언된 메서드는 공용이어야 하므로 `Money`의 `reduce` 메서드도 공용이어야 한다.

이제 `reduce` 메서드의 인자값을 통해서 `Bank` 클래스의 인스턴스에 접근이 가능하다. 즉, 환율을 `Bank`에서 처리할 수 있게 됐다.

```typescript
class Bank {
  // ...

  rate(from: CurrencyTypes, to: CurrencyTypes) {
    return from === CURRENCY.FRANC && to === CURRENCY.DOLLAR ? 2 : 1;
  }
}
```

기존에 `Money`의 `reduce` 메서드에서 직접 환율을 계산하던 로직을 제거하고 `Bank` 클래스의 인스턴스가 이를 계산하게 만들어 보자.

```typescript
class Money implements Expression {
  // ...

  reduce(bank: Bank, to: CurrencyTypes): Money {
    const rate = bank.rate(this.currency, to);

    return new Money(this.amount / rate, to);
  }

  // ...
}
```

`Money`가 환율이라는 정보를 모르도록 `Bank`에서 환율 계산을 하도록 만들게 변경을 완료했다.

## 상수값 `2` 제거하기

또 다른 문제가 있다. 상수값 `2`가 테스트에도 구현부 코드에도 존재한다.  
이를 없애려면 `Bank`에서 환율표를 갖게 있다가 나중에 필요할 때 해당 환율표를 이용해서 찾아볼 수 있도록 해야 한다.

> 책에서는 두 개의 통화와 환율을 매핑시키는 해시 테이블을 사용한다. 자바스크립트에는 해시 테이블을 따로 제공해주지 않기 때문에 책에 나오는 예제와 비슷하게 구현해서 사용하도록 한다.

환율표에 대한 관리는 해시 테이블로 하고 지금은 해시 테이블에서 키로 사용할 객체를 만들어 보자.

```typescript
class Pair {
  #from: string;
  #to: string;

  constructor(from: string, to: string) {
    this.#from = from;
    this.#to = to;
  }
}

export default Pair;
```

> 책에서는 `Pair` 클래스에 `equals`와 `hashCode` 메서드를 구현한다. 이는 자바에서 지원해주는 `HashTable` 클래스에서 `equals`와 `hashCode`를 사용하기 때문이다.

> _`hashCode` 메소드를 실행해서 리턴된 해시코드 값이 같은지를 본다. 해시 코드값이 다르면 다른 객체로 판단하고, 해시 코드값이 같으면 `equals` 메소드로 다시 비교한다. 이 두 개가 모두 맞아야 동등 객체로 판단한다. 즉, 해시코드 값이 다른 엔트리끼리는 동치성 비교를 시도조차 하지 않는다._  
> https://jisooo.tistory.com/entry/java-hashcode%EC%99%80-equals-%EB%A9%94%EC%84%9C%EB%93%9C%EB%8A%94-%EC%96%B8%EC%A0%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B3%A0-%EC%99%9C-%EC%82%AC%EC%9A%A9%ED%95%A0%EA%B9%8C

`Pair` 클래스의 인스턴스를 키로 사용할 것이기 때문에 `equals`와 `hashCode` 메서드를 구현한다.

지금은 리팩토링하는 중에 코드를 작성하는 것이기 때문에 테스트를 따로 작성하지는 않는다. 이 리팩토링을 마치고 테스트가 모두 통과한다면, 그때 그 코드가 실제로 사용되었다고 생각할 수 있다.

```typescript
class Pair {
  #from: CurrencyTypes;
  #to: CurrencyTypes;

  constructor(from: CurrencyTypes, to: CurrencyTypes) {
    this.#from = from;
    this.#to = to;
  }

  get from() {
    return this.#from;
  }

  get to() {
    return this.#to;
  }

  equals(newPair: Pair) {
    return this.from === newPair.from && this.to === newPair.to;
  }

  hashCode() {
    return 0;
  }
}
```

## 환율표

> 책의 예제와 비슷하게 가기 위해 `HashTable`, `LinkedList`에 대한 테스트 케이스 그리고 이를 기반으로 한 기능을 구현

`0`은 최악의 해시 코드지만 구현하기 쉽고 지금 정해놓은 목표까지 빠르게 달려갈 수 있게 해준다. 하나의 상수값만 해시 코드로 사용하니 선형 탐색과 비슷하겠지만 추후에 더 많은 통화를 다뤄야 하는 때가 오면 수정하고 지금은 이대로 진행한다.

환율을 저장할 저장소, `HashTable`이 필요하다(미리 구현해놓은 `HashTable`을 이용한다).

```typescript
class Bank {
  #hashTable: HashTable;

  constructor() {
    this.#hashTable = new HashTable();
  }

  // ...
}
```

환율을 설정할 수도 있어야 한다.

```typescript
class Bank {
  // ...

  addRate(from: CurrencyTypes, to: CurrencyTypes, rate: number) {
    const pair = new Pair(from, to);

    this.#hashTable.put(pair, rate);
  }
}
```

그리고 필요할 때 환율을 얻어낼 수도 있어야 한다.

```typescript
class Bank {
  // ...

  rate(from: CurrencyTypes, to: CurrencyTypes) {
    const pair = new Pair(from, to);

    return this.#hashTable.get(pair);
  }

  // ...
}
```

테스트가 통과할 줄 알았는데 실패한다. 어디서 실패했는가를 살펴보면 다음 코드에서 문제가 발생한다.

```typescript
test('Bank의 reduce에 Money가 들어올 경우에 대한 검증', () => {
  const bank = new Bank();

  const result = bank.reduce(Money.dollar(1), CURRENCY.DOLLAR);

  expect(Money.dollar(1).equals(result)).toBe(true);
});
```

테스트 케이스를 살펴보면 USD에서 USD로의 환율을 요청하면 그 값이 1이 되어야 한다는 내용이다.

책에서는 뜻밖의 일이기 때문에 코드를 볼 다른 사람들을 위해 이것 또한 테스트 케이스로 만든다.

```typescript
test('USD에서 USD로의 환율을 요청하면 그 값이 1이 되어야 한다', () => {
  expect(new Bank().rate(CURRENCY.DOLLAR, CURRENCY.DOLLAR)).toBe(1);
});
```

에러를 해결하기 위해 코드를 추가로 작성한다.

```typescript
class Bank {
  // ...

  rate(from: CurrencyTypes, to: CurrencyTypes) {
    if (from === to) {
      return 1;
    }

    const pair = new Pair(from, to);

    return this.#hashTable.get(pair);
  }

  // ...
}
```

같은 통화에 대한 환율 반환이 이제 정상적으로 이루어 진다.  
이제 할 일 목록을 업데이트하자.

- [ ] $5 + 10CHF = $10 (환율이 2:1일 경우)
- [x] ~~$5 + $5 = $10~~
- [ ] $5 + $5에서 Money 반환하기
- [x] ~~Bank.reduce(Money)~~
- [x] ~~Money에 대한 통화 변환을 수행하는 Reduce~~
- [x] ~~Reduce(Bank, String)~~

## 검토

- 코드와 테스트 사이에 있는 데이터 중복을 끄집어 냈다.
- 리팩토링 하다가 실수를 했고, 그 문제를 분리하기 위해 또 하나의 테스트를 작성하면서 계속 전진해 나가기로 했다.
- 전용(private) 도우미(helper) 클래스를 만들었다.
