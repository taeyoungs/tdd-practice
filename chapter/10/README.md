# Chapter 10 - 흥미로운 시간

**목차**

- [Chapter 10 - 흥미로운 시간](#chapter-10---흥미로운-시간)
  - [개요](#개요)
  - [`times` 메서드 일치시키기](#times-메서드-일치시키기)
  - [`equals` 메서드 수정](#equals-메서드-수정)
  - [상위 클래스로 `times` 메서드 끌어올리기](#상위-클래스로-times-메서드-끌어올리기)
  - [검토](#검토)

## 개요

본격적인 작업에 앞서서 할 일 목록을 살펴보자.

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
- [ ] **공용 times**
- [x] ~~Franc와 Dollar 비교하기~~
- [x] ~~통화?~~
- [ ] `francMultiplication.test.js`를 지워야 할까?

Chapter 9를 통해서 통화 개념을 테스트하고 구현하는데 성공했다.

이제 `times` 메서드만 하위 클래스에서 상위 클래스로 올리게 된다면 `Money`를 나타내기 위한 단 하나의 클래스만을 갖게 될 것이다.  
하위 클래스 `times` 메서드를 상위 클래스로 올리려면 하위 클래스들의 `times` 메서드 구현이 비슷한 것이 아니라 동일해야 한다.

```javascript
export class Dollar extends Money {
  // ...

  times(multiplier) {
    return Money.dollar(super.amount * multiplier);
  }
}

export class Franc extends Money {
  // ...

  times(multiplier) {
    return Money.franc(super.amount * multiplier);
  }
}
```

현재는 거의 비슷할 뿐 완전히 동일하지는 않다. 두 메서드를 동일하게 만들고는 싶지만 이 상태로는 명백한 방법이 떠오르지 않는다.  
따라서, 일보 전진을 위한 후퇴를 감행한다.

## `times` 메서드 일치시키기

팩토리 메서드를 인라인 시켜보자.

```javascript
export class Dollar extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Dollar(super.amount * multiplier, CURRENCY.DOLLAR);
  }
}

export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Franc(super.amount * multiplier, CURRENCY.FRANC);
  }
}
```

팩토리 메서드를 호출하기 전 코드로 돌아왔다. 팩토리 메서드를 직접 인라인 시켰으므로 당연히 코드도 잘 돌아가고 테스트도 통과한다.  
하위 클래스의 `currency` 인스턴스 변수는 항상 `CURRENCY.DOLLAR`, `CURRENCY.FARNC` 일테니 이를 `currency` 인스턴스 변수의 전달로 바꾸도록 하자.

```javascript
export class Dollar extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Dollar(super.amount * multiplier, super.currency);
  }
}

export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Franc(super.amount * multiplier, super.currency);
  }
}
```

`times` 메서드의 코드가 거의 비슷해졌다. `Dollar`와 `Franc` 클래스를 구별해서 가져야 하는게 정말로 중요할까? Chapter 9에서 통화 개념에 대한 테스트를 추가하고 이를 통화하는 기능을 구현했다. 이 통화로 구별할 순 없을까?

쉽게 생각할 문제는 아니지만 나에겐 지금까지 작성해놓은 테스트 코드가 있다. 설계에 대해 고민하는 것도 좋지만 쌓아놓은 결과물(테스트 코드)이 있으니 이를 수정하여 컴퓨터가 검증하게 만들 수도 있다. `Dollar`와 `Franc` 클래스를 구별하지 않고 `Money` 클래스로 대체하여 테스트 코드를 돌려본다면 컴퓨터가 답을 알려줄 것이다.

이를 위해 `Franc.times()`가 `Money` 인스턴스를 반환하도록 고쳐보자.

```javascript
export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Money(super.amount * multiplier, super.currency);
  }
}
```

## `equals` 메서드 수정

테스트가 실패한다.

실패하는 것은 괜찮다. 실패하는 이유를 확인해보자.

`equals` 메서드를 사용하는 테스트 코드들이 전부 실패하고 있다.

> 책에서는 디버그용 `toString` 메서드를 추가하여 조금 더 자세한 테스트 실패에 대한 이유를 추적할 수 있게 만든다.
>
> 이를 자바스크립트에서는 어떻게 디버그에 대한 도움을 줄 수 있는지 모르겠다.  
> 당장 생각나는 방법은
>
> - `equals` 메서드 내에 `console.log`를 추가하는 방법
> - `equals` 메서드 내에 임시로 추가 분기점을 만드는 것
>
> 둘 다 마음에 들지 않는다. 테스트의 실패 원인이 추적이 제대로 되지 않는다는 것부터가 문제인걸까? 아니면 이런 예외 케이스에 대한 추가적인 추적 방법을 추가하는 것이 맞는 것일까? 🤔

테스트 코드들이 실패하는 이유는 `times` 메서드가 `Franc` 클래스의 인스턴스를 더 이상 반환하지 않고 `Money` 클래스의 인스턴스를 반환하기에 `equals` 메서드 내에서 생성자를 비교하는 구문이 의미가 없어졌기 때문이다.
즉, 문제는 `equals()` 구현에 있다.

정말로 검사해야 할 것은 생성자가 같은지가 아니라 `currency`, 다시 말해 통화가 같은지 여부다.

이번엔 보수적인 방법을 사용한다.

1. 변경된 코드를 되돌려 테스트가 마지막으로 통과했던 지점으로 돌아가고
2. `equals()`를 위해 테스트를 고치고
3. `equals()` 구현을 수정하고
4. 원래 하고 있던 작업으로 되돌아간다.

테스트가 통과하던 지점은 `Franc.times()`가 `Money` 인스턴스를 반환하게 만들기 바로 전이다. 이때로 돌아가자.

```javascript
export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Franc(super.amount * multiplier, super.currency);
  }
}
```

테스트는 통과한다.  
`Franc(10, 'CHF')`와 `Money(10, 'CHF')`가 같기를 바라는데 그렇지 않은 상황이니 이걸 그대로 테스트로 만들어서 사용한다.

```javascript
import { Money, Franc, CURRENCY } from '../js/internal';

test("Franc(10, 'CHF')와 Money(10, 'USD')는 같아야 한다.", () => {
  expect(new Money(10, CURRENCY.FRANC).equals(new Franc(10, CURRENCY.FRANC))).toBe(true);
});
```

바로 위에서 이 부분에서 문제가 발생했으니 테스트로 만들면 예상대로 실패한다.

이제 `equals` 메서드는 클래스가 아니라 `currency`, 즉 통화를 비교해야 한다.

```javascript
import { Dollar, Franc, CURRENCY } from './internal';

export class Money {
  // ...

  equals(instance) {
    const isSameCurrency = this.currency === instance.currency;

    return this.amount === instance.amount && isSameCurrency;
  }

  // ...
}
```

## 상위 클래스로 `times` 메서드 끌어올리기

이제 `Franc.times()`에서 `Money` 클래스의 인스턴스를 반환해도 테스트가 통과하는 것을 확인할 수 있다.

`Dollar` 클래스가 가진 `times`에도 적용하고 테스트가 통과하는지 확인하자.

```javascript
export class Dollar extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Money(super.amount * multiplier, super.currency);
  }
}

export class Franc extends Money {
  constructor(amount, currency) {
    super(amount, currency);
  }

  times(multiplier) {
    return new Money(super.amount * multiplier, super.currency);
  }
}
```

테스트가 모두 통과한다.

이제 하위 클래스의 `times` 메서드의 구현이 동일해졌으니 상위 클래스로 올릴 준비가 됐다.

```javascript
export class Money {
  // ...

  times(multiplier) {
    return new Money(this.amount * multiplier, this.currency);
  }

  // ...
}
```

작업을 완료했으니 할 일 목록을 업데이트하자.

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
- [x] ~~공용 times~~
- [x] ~~Franc와 Dollar 비교하기~~
- [x] ~~통화?~~
- [ ] `francMultiplication.test.js`를 지워야 할까?

## 검토

- 두 `times()`를 일치시키기 위해 그 메서드들이 호출하는 다른 메서드들을 인라인시킨 후 상수를 변수로 바꿔주었다.
- `Franc` 대신 `Money`를 반환하는 변경을 시도한 뒤 그것이 잘 동작할지를 테스트가 말하도록 했다.
- 실험해본 걸 뒤로 물리고 또 다른 테스트를 작성했다. 테스트를 작동했더니 실험도 제대로 작동했다.
