# Chapter 6 - 돌아온 '모두를 위한 평등'

## 개요

Chapter 5에서 업데이트한 할 일 목록을 다시 살펴보자.

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
- [ ] **공용 equals**
- [ ] 공용 times

Chapter 6에서는 '공용 equals' 항목에 집중할 것이다.

Chapter 5에서 테스트 하나를 통과하게 만들었다. 하지만 해당 테스트를 통과하게 만들기 위해 '복사 + 붙여넣기' 후 수정을 하는 죄악을 저질렀기 때문에 이제 이를 해결해야 한다.

## 공통 상위 클래스

이 죄악을 해결할 수 있는 방법은 두 가지가 있다.

1. 하나의 클래스가 나머지 하나의 클래스를 상속받게 하는 것
2. **두 클래스가 공통으로 상속받을 공통 상위 클래스를 만드는 것**

첫 번째 방법은 두 클래스 중 어느 하나의 클래스도 시원하게 해결해주지 못한다. 따라서, 두 번째 방법을 사용하여 Chapter 5에서 저지른 죄악을 해결해볼 것이다.

```
+--------+--------------+
| Dollar |    Money     |
+--------+--------------+
| Franc  | Dollar Franc |
+--------+--------------+
```

### Money 클래스

두 클래스의 공통 상위 클래스로 `Money` 클래스를 구현할 것이다. 이때, 이 `Money` 클래스가 두 클래스가 모두 가지고 있는 `equals` 메서드를 갖게 하는건 어떨까?

우선 `Money` 클래스를 구현한다.

```javascript
class Money {}
```

테스트는 여전히 통과한다. `Money` 클래스를 구현하긴 했지만 해당 클래스를 어디에서도 참조하지 않기 때문이다. `Money` 클래스 내부에 아무것도 구현하지 않았으므로 `Dollar` 클래스가 `Money` 클래스를 상속받게 만들어도 테스트엔 이상이 없다.

> 테스트는 기능 구현 중에도 주기적으로 돌려보는 것이 좋다. 잘 돌아가고 있던 테스트가 기능 구현 중에 예기치 못하게 실패한다면 무엇인가 잘못된 상황이란걸 알려주는 것일테니

```javascript
import Money from './Money';

class Dollar extends Money {
  #amount;

  constructor(amount) {
    this.#amount = amount;
  }

  // ...
}

export default Dollar;
```

### `amount` 인스턴스 변수 이동

테스트가 여전히 잘 통과하고 있으므로 `amount` 인스턴스 변수를 `Money` 클래스로 옮겨보자.

```javascript
class Money {
  #amount;

  constructor(amount) {
    this.#amount = amount;
  }

  get amount() {
    return this.#amount;
  }
}

export default Money;
```

책에서는 Money 클래스로 `amount` 인스턴스 변수를 옮기고 `amount` 변수의 접근 제한자를 `protected`로 변경하지만 여기선 타입스크립트를 사용하고 있지도 않고 자바스크립트를 사용하고 있기 때문에 `Dollar` 클래스에 추가적인 코드 수정을 진행한다.

```javascript
import Money from './Money';

class Dollar extends Money {
  constructor(amount) {
    super(amount);
  }

  times(multiplier) {
    return new Dollar(super.amount * multiplier);
  }

  equals(instance) {
    return super.amount === instance.amount;
  }
}

export default Dollar;
```

우선, `amount` 인스턴스 변수를 `Money` 클래스로 옮기는 것까지는 동일하다. 하지만 해당 변수의 초기화는 `Dollar` 클래스에서 수행하고 있기 때문에 `super` 메서드를 호출하여 `Money` 클래스로 옮겨진 `amount` 인스턴스 변수를 초기화한다.

기존에 `this` 변수를 통해 참조하고 있던 구문들을 `super`로 변경하여 `Money` 클래스의 인스턴스 변수를 참조할 수 있도록 변경해준다.

### `equals` 메서드 이동

`amount` 인스턴스 변수를 `Money` 클래스로 옮기고 테스트도 통과하는 것을 확인했으니 이제 `equals` 메서드도 `Money` 클래스로 옮길 수 있게 됐다.

```javascript
class Money {
  #amount;

  constructor(amount) {
    this.#amount = amount;
  }

  get amount() {
    return this.#amount;
  }

  equals(instance) {
    return this.amount === instance.amount;
  }
}

export default Money;
```

### `Franc` 클래스의 `equals` 메서드 제거

이제 `Franc` 클래스의 `equals` 메서드를 제거해야 한다.

`Money` 클래스로 `equals` 메서드를 옮겼지만 이 메서드가 `Franc` 클래스 인스턴스의 동치성 테스트를 수행하고 있지 않다. 왜냐하면 우리는 '복사 + 붙여넣기'라는 죄악을 저질렀기 때문에 `Money` 클래스를 구현하고 `Dollar` 클래스도 수정했지만 청산해야할 죄악이 남아 있는 것이다.

> 테스트 코드를 갖추지 못한 코드를 리팩토링하는 경우도 분명 발생할 것이다. 이말인 즉슨 리팩토링을 하면서 뭔가 문제가 생겨도 알아차리기 힘들다는 것이다.
>
> 그렇기에 이런 경우를 만나게 되면 **있으면 좋을 것 같은 테스트를 먼저 작성**하자. 리팩토링을 수행하기 전에 테스트를 작성함으로써 리팩토링을 수행하더라도 자신감을 가지고 전진할 수 있게 될 것이다.

`Franc` 클래스의 리팩토링을 수행하기 전에 `Franc` 클래스에 대한 동치성 테스트를 먼저 작성하자. 이 테스트는 `Dollar` 클래스의 동치성 테스트와 별반 다를게 없으므로 `Dollar` 테스트를 복사해서 사용하자.

```javascript
import Dollar from '../js/Dollar';
import Franc from '../js/Franc';

test('생성자 함수 인자에 동일한 값을 전달한 인스턴스는 같아야 한다.', () => {
  expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
  expect(new Dollar(5).equals(new Dollar(6))).toBe(false);
  expect(new Franc(5).equals(new Franc(5))).toBe(true);
  expect(new Franc(5).equals(new Franc(6))).toBe(false);
});
```

앞선 케이스를 통해서 알 수 있겠지만 '복사 + 붙여넣기'라는 죄악을 저질렀고 이로 인해 중복이 발생했다. 죄악을 저질렀으면 이에 대한 해결이 필요하다. `Franc` 클래스를 먼저 해결하고 이 또한 해결할 것이다.

### Franc 클래스 수정

`Dollar` 클래스와 같이 `Franc` 클래스도 `Money` 클래스를 상속받고 이에 따라 코드를 수정한다.

```javascript
import Money from './Money';

class Franc extends Money {
  constructor(amount) {
    super(amount);
  }

  times(multiplier) {
    return new Franc(super.amount * multiplier);
  }
}

export default Franc;
```

`Franc` 클래스를 수정한 후에 테스트를 돌려봐도 여전히 테스트는 통과하고 있다. 근데 동치성 테스트로 Dollar와 Franc를 비교하면 어떻게 될까? 이를 인지하고 이제 할 일 목록을 업데이트 해보자.

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
- [ ] Franc와 Dollar 비교하기

## 검토

- 공통된 코드를 첫 번째 클래스에서 상위 클래스로 단계적으로 옮겼다.
- 두 번째 클래스도 Money의 하위 클래스로 만들었다.
- 불필요한 구현을 제거하기 전에 두 `equals()` 구현을 일치시켰다.
