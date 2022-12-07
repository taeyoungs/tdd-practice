# Chapter 9 - 우리가 사는 시간

## 개요

본격적인 작업에 앞서 Chapter 8에서 업데이트했던 할 일 목록을 다시 살펴보자.

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
- [ ] Dollar/Franc 중복
- [x] ~~공용 equals~~
- [ ] 공용 times
- [x] ~~Franc와 Dollar 비교하기~~
- [ ] **통화?**
- [ ] `francMultiplication.test.js`를 지워야 할까?

위 할 일 목록에서 어떤 것을 해결해야 귀찮고 불필요한 하위 클래스를 제거하는데 도움이 될까?

책에서는 하위 클래스를 제거하기 위한 1보 전진의 방법으로 **통화(currency)** 개념을 도입해보는 것을 선택한다.

까먹었을 수도 있으니 다시 상기시키기 위해 TDD 사이클을 되짚어보자.

1. 작은 테스트를 하나 추가한다.
2. 모든 테스트를 실행해서 테스트가 실패하는 것을 확인한다.
3. 조금 수정한다.
4. 모든 테스트를 실행해서 테스트가 성공하는 것을 확인한다.
5. 중복을 제거하기 위해 리팩토링을 한다.

다시 통화(currency) 개념을 도입하는 작업으로 돌아오자. TDD 사이클을 기반으로 하면 지금 해야할 것은 테스트를 추가하는 것이다.

## 통화(currency) 테스트

**통화 개념을 어떻게 테스트해야 할까?**

통화를 표현하기 위한 복잡한 객체를 만들 수도 있지만 지금은 문자열을 사용하여 표현하자.

```javascript
import { Money, CURRENCY } from '../js/internal';

test('통화(currency) 테스트', () => {
  expect(Money.dollar(1).currency()).toBe(CURRENCY.DOLLAR);
  expect(Money.franc(1).currency()).toBe(CURRENCY.FRANC);
});
```

`Dollar`와 `Franc` 인스턴스에 `currency` 메서드는 구현한 적이 없으니 테스트는 당연히 실패한다. 테스트가 실패하는 것을 확인했으니 실패하는 테스트를 통과시키기 위해 기능을 구현한다.

## currency method

우선 `Money` 클래스에 `currency` 메서드를 구현한다.

```javascript
export class Money {
  // ...

  currency() {}
}
```

> 자바스크립트에 추상 클래스는 없지만 메서드 오바라이딩은 가능하다. 정확히는 프로토타입 체인에 의해서 하위 클래스의 메서드를 먼저 찾기 때문에 해당 메서드를 호출하는 것이긴 하지만 책과 최대한 비슷하게 가기 위해 상위 클래스에 `currency` 메서드의 껍데기만 구현하고 하위 클래스에 `currency` 메서드를 각각 구현해준다.

그 다음 하위 클래스에 `currency` 메서드를 각각 구현한다.

```javascript
// Dollar class
export class Dollar extends Money {
  // ...

  currency() {
    return CURRENCY.DOLLAR;
  }
}

// Franc class
export class Franc extends Money {
  // ...

  currency() {
    return CURRENCY.FRANC;
  }
}
```

두 클래스를 모두 포함할 수 있는 기능을 구현해야 한다. 통화를 인스턴스 변수에 저장하고 이를 메서드가 반환하도록 만들어 주자.

```javascript
// Dollar class
export class Dollar extends Money {
  #currency;

  constructor(amount) {
    super(amount);
    this.#currency = CURRENCY.DOLLAR;
  }

  // ...

  currency() {
    return this.#currency;
  }
}

// Franc class
export class Franc extends Money {
  #currency;

  constructor(amount) {
    super(amount);
    this.#currency = CURRENCY.FRANC;
  }

  // ...

  currency() {
    return this.#currency;
  }
}
```

이제 두 `currency` 메서드가 동일하므로 `currency` 인스턴스 변수 선언와 메서드 구현을 상위 클래스인 `Money` 클래스로 올릴 수 있게 됐다.

```javascript
import { Dollar, Franc } from './internal';

export class Money {
  #amount;
  #currency;

  constructor(amount) {
    this.#amount = amount;
  }

  get amount() {
    return this.#amount;
  }

  get currency() {
    return this.#currency;
  }

  // ...
}
```

> 책의 예제를 보면 아직 각 하위 클래스가 `amount` 인스턴스 변수를 가지고 있는데 앞선 챕터에서 예제를 따라하다가 `Money` 클래스의 인스턴스 변수를 사용하게 만들어 버렸다. 책에서는 Chapter 9의 마지막에서 `super` 메서드를 사용하여 그제서야 상위 클래스의 인스턴스 변수를 사용하도록 만드니 주의하자.

문자열 `USD`와 `CHF`를 정적 팩토리 메서드로 옮긴다면 두 생성자가 동일해질 것이고(위 예제를 보면 알 수 있듯이 지금은 초기화 구문 때문에 생성자가 완전히 동일하지는 않다) 그렇다면 공통 구현을 만들 수 있을 것이다.

```javascript
// Dollar class
export class Dollar extends Money {
  #currency;

  constructor(amount, currency) {
    super(amount);
    this.#currency = CURRENCY.DOLLAR;
  }

  // ...

  currency() {
    return this.#currency;
  }
}

// Franc class
export class Franc extends Money {
  #currency;

  constructor(amount, currency) {
    super(amount);
    this.#currency = CURRENCY.FRANC;
  }

  // ...

  currency() {
    return this.#currency;
  }
}
```

> 책에서는 자바를 사용하기 때문에 생성자 함수에 `currency` 매개변수를 추가하면 컴파일 에러가 발생하고 이에 따른 조치를 취해주지만 여기선 자바스크립트를 사용하고 있기 때문에 추가로 들어오는 매개변수로 인해 런타임 에러가 발생하지는 않는다.

## `times` 메서드 수정

Dollar와 Franc의 times 메서드를 보면 정적 팩토리 메서드를 호출하지 않고 각 클래스의 생성자 함수를 호출하고 있다.

이렇게 지금 하고 있는 작업이 있는 상황에서 문제를 발견한 경우 당장 고칠 수도 있고 하던 작업을 마무리하고 고칠 수도 있다. 그럼 당장 고쳐야 할까? 아니면 기다렸다가 나중에 고쳐야 할까? 무엇이 맞는 것일까?

**정답은 없다.**

책의 저자인 켄트 백은 문제를 발견하고 이를 고치는 작업으로 발생하는 중단 시간이 짧을 경우 이를 받아들이고 고치는 작업을 진행한다고 한다. 단, 고치는 작업 도중에 추가적으로 중단을 하진 않는다.

`times` 메서드를 고치는 데 시간이 많이 필요하지 않을 것 같으니 `times` 메서드부터 고치자.

```javascript
// Dollar class
export class Dollar extends Money {
  // ...

  times(multiplier) {
    return Money.dollar(super.amount * multiplier);
  }

  // ...
}

// Franc class
export class Franc extends Money {
  // ...

  times(multiplier) {
    return Money.franc(super.amount * multiplier);
  }

  // ...
}
```

`times` 메서드를 수정하고 테스트를 돌려서 통과되는지 확인하자.

## 팩토리 메서드 수정

이제 팩토리 메서드를 수정할 수 있다.

```javascript
import { Dollar, Franc, CURRENCY } from './internal';

export class Money {
  // ...

  static dollar(amount) {
    return new Dollar(amount, CURRENCY.DOLLAR);
  }

  static franc(amount) {
    return new Franc(amount, CURRENCY.FRANC);
  }
}
```

마지막으로 각 하위 클래스 생성자 함수의 `currency` 매개변수를 `#curreny` 인스턴스 변수에 할당할 수 있다.

```javascript
// Money class
export class Dollar extends Money {
  #currency;

  constructor(amount, currency) {
    super(amount);
    this.#currency = currency;
  }

  // ...

  currency() {
    return this.#currency;
  }
}

// Franc class
export class Franc extends Money {
  #currency;

  constructor(amount, currency) {
    super(amount);
    this.#currency = currency;
  }

  // ...

  currency() {
    return this.#currency;
  }
}
```

책에서 보여주고 있는 이런 작은 단계들은 실무에서 이런 식으로 작업을 해야한다고 주장하는 것이 아니라 이런 식으로도 일할 수도 있어야 한다고 말해주기 위한 것들이다.

이러한 사이클들은 **TDD**를 하는 동안 지속적으로 해주어야 하는 **일종의 조율**이다.

작은 단계들로 이루어진 사이클을 반복하되 이 과정이 답답하다면 조금 더 큰 단계들을 밟아나가고 여전히 불안하다면 계속해서 작은 단계들을 밟아나가면 되는 것이다.

**올바른 보폭이라는 것은 존재하지 않는다.**

두 생성자가 동일해졌으므로 구현을 상위 클래스로 올릴 준비가 됐다.

```javascript
export class Money {
  #amount;
  #currency;

  constructor(amount, currency) {
    this.#amount = amount;
    this.#currency = currency;
  }

  get amount() {
    return this.#amount;
  }

  get currency() {
    return this.#currency;
  }

  // ...
}

export class Dollar extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  // ...

  currency() {
    return super.currency;
  }
}

export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  // ...

  currency() {
    return super.currency;
  }
}
```

통화 개념을 해결했다. 이제 할 일 목록을 업데이트 해보자.

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
- [ ] Dollar/Franc 중복
- [x] ~~공용 equals~~
- [ ] 공용 times
- [x] ~~Franc와 Dollar 비교하기~~
- [x] ~~통화?~~
- [ ] `francMultiplication.test.js`를 지워야 할까?

## 검토

- 큰 설계 아이디어를 다루다가 조금 곤경에 빠졌다. 그래서 좀 전에 주목했던 더 작은 문제를 해결했다.
- 다른 부분들을 팩토리 메서드로 옮김으로써 하위 클래스들의 생성자 함수를 일치시켰다.
- `times` 메서드가 팩토리 메서드를 사용하도록 만들기 위해 리팩토링을 잠시 중단했다.
- 동일한 생성자들을 상위 클래스로 옮겼다.
