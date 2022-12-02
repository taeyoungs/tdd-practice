# Chapter 4 - 프라이버시

**목차**

- [Chapter 4 - 프라이버시](#chapter-4---프라이버시)
  - [개요](#개요)
  - [`amount`를 `private`으로 만들기](#amount를-private으로-만들기)
  - [완벽함을 위해 노력하지는 않는다.](#완벽함을-위해-노력하지는-않는다)
  - [검토](#검토)

## 개요

개념적으로 `Dollar.times()` 연산은 호출을 받은 객체의 값에 인자로 받은 수만큼 곱한 값을 갖는 `Dollar` 인스턴스를 반환해야 한다.

하지만 Chapter 2에서 `Dollar` 클래스의 부작용을 해결하면서 초기에 계획했던 인터페이스의 설계를 수정했다. 테스트 코드를 작성하고 이를 통과시키기 위한 기능 구현 그리고 중복 제거의 사이클을 반복해서 진행하고 있기 때문에 인터페이스의 수정이 발생한 지금 테스트 코드는 현재 내가 원하는 바를 테스트하고 있다고 말할 수 없다.

따라서, 기존에 작성해놓은 `multiplication` 테스트 코드를 `Dollar` 인스턴스와 `Dollar` 인스턴스를 비교하는 것으로 재작성한다.

## `amount`를 `private`으로 만들기

```javascript
import Dollar from '../js/Dollar.js';

test('어떤 금액(주가)을 어떤 수(주식의 수)에 곱한 금액을 결과로 얻을 수 있어야 한다.', () => {
  const five = new Dollar(5);

  let product = five.times(2);
  expect(new Dollar(10).equals(product)).toBe(true);
  product = five.times(3);
  expect(new Dollar(15).equals(product)).toBe(true);
});
```

이제 임시 변수인 `product`는 쓸모 없어 보이므로 제거하자.

```javascript
import Dollar from '../js/Dollar.js';

test('어떤 금액(주가)을 어떤 수(주식의 수)에 곱한 금액을 결과로 얻을 수 있어야 한다.', () => {
  const five = new Dollar(5);

  expect(new Dollar(10).equals(five.times(2))).toBe(true);
  expect(new Dollar(15).equals(five.times(3))).toBe(true);
});
```

> ✋ **주의**
>
> `equals` 메서드를 구현하는 이유는 책에서 사용하는 **JUnit**의 `assertEquals` 메서드가 인자로 전달받은 인스턴스의 `equals` 메서드를 호출해주기 때문이다. 현재 자바스크립트와 jest를 사용하고 있기 때문에 Chapter 4에서 `assertEquals` 대신 `equals` 메서드를 직접 호출하고 이를 통해 반환받은 값을 **jest**의 `toBe` 메서드로 각 인스턴스의 멤버 변수 값을 비교하는 것으로 대체한다.

이 테스트는 일련의 기능이 아니라 참인 명제에 대한 단언들이므로 코드의 의도를 더 명확하게 이야기해준다.

> `assertEquals`로 작성되어 있는 **JUnit** 테스트 코드에는 "일련의 기능이 아니라 참인 명제에 대한 단언들"이라는 말이 와닿기는 하는데 이걸 **jest**로 대체한 위 코드(내가 작성한)가 이를 대변할 수 있는지는 잘 모르겠다.

테스트를 인터페이스 수정에 맞게 고치고 나니 `Dollar`의 `amount` 인스턴스 변수를 사용하는 코드는 `Dollar` 클래스 자신밖에 없게 됐다. 인스턴스의 멤버 변수를 참조하는 곳이 클래스 본인 밖에 없기 때문에 `amount` 인스턴스 변수를 `private`으로 변경할 수 있다.

> 책에서는 `equals` 메서드 내에 `Dollar` 클래스 타입으로 캐스팅을 해주는 부분이 있는데 캐스팅을 해줌으로써 `private`으로 변경한 `amount` 인스턴스 변수에도 접근이 가능한 걸까? 🧐

> `equals` 메서드를 사용해서 인스턴스 간의 동치성을 확인하기 위해서는 메서드 매개변수로 전달되는 인스턴스의 `amount` 변수의 값을 알 수 있긴 해야 한다. `#` 키워드를 통해 `amount` 변수를 `private` 변수로 만들어 주고 `amount`의 `getter` 접근자 프로퍼티를 하나 만들어 `amount` 변수의 값을 읽기는 가능하도록 만들었다.

```javascript
class Dollar {
  #amount;

  constructor(amount) {
    this.#amount = amount;
  }

  get amount() {
    return this.#amount;
  }

  times(multiplier) {
    return new Dollar(this.#amount * multiplier);
  }

  equals(instance) {
    return this.#amount === instance.amount;
  }
}

export default Dollar;
```

이제 할 일 목록에서 또 다른 항목 하나를 지울 수 있게 됐다.

- [ ] $5 + 10CHF = $10 (환율이 2:1일 경우)
- [x] ~~$5 x 2 = $10~~
- [x] ~~`amount`를 `private`으로 만들기~~
- [x] ~~`Dollar` 부작용 ?~~
- [ ] `Money` 반올림 ?
- [x] ~~equals()~~
- [ ] hashCode()
- [ ] Equal null
- [ ] Equal object

## 완벽함을 위해 노력하지는 않는다.

`amount`를 `private` 변수로 만들긴 했지만 이 과정을 통해 위험한 상황도 만들어 졌다는 것을 인지해야 한다.

만약 Chapter 3에서 작성한 동치성 테스트가 동치성 검증을 제대로 하지 못하게 된다면 `multiplication` 테스트 역시 제대로된 검증이 이루어 지지 않는다는 것을 의미하기 때문이다. 이는 TDD를 하면서 계속해서 적극적으로 관리해야할 위험 요소다.

**완벽함을 위해 노력하지는 않는다.**

테스트 코드를 작성하고 이를 통과시키기 위한 기능을 구현함으로써 구현한 기능에 대한 자신감을 갖고 다음 작업을 할 수 있도록 결함의 정도를 낮추기를 바랄 뿐이다.  
당연히 테스트 코드에 구멍이 생겨 제대로 된 검증을 하지 못할 수도 있다. 이러한 실패 과정에 대해서 낙담을 하는 것이 아니라 이러한 과정을 밑거름으로 테스트를 어떻게 작성했어야 했는지에 대해 교훈을 얻고 다시 앞으로 나아가야 한다.

## 검토

- 오직 테스트를 향상시키기 위해서만 개발된 기능을 사용했다.
  - 앞에서도 언급을 했지만 책에서는 **JUnit**의 `assertEquals` 메서드와 동치성 검증을 위한 `equals` 메서드를 구현한다.
- 두 테스트가 동시에 실패하면 망한다는 점을 인식했다.
- 위험 요소가 있음에도 계속 진행했다.
- 테스트와 코드 사이의 결합도를 낮추기 위해, 테스트하는 객체의 새 기능을 사용했다.
  - 인터페이스를 수정하고 이를 반영하여 테스트 코드를 수정함으로써 테스트 코드에서 `amount` 변수에 대한 직접 참조 구문을 모두 제거했고 이를 통해 **decoupling** 효과를 얻었다.
