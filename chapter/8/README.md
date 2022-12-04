# Chapter 8 - 객체 만들기

**목차**

- [Chapter 8 - 객체 만들기](#chapter-8---객체-만들기)
  - [개요](#개요)
  - [하위 클래스에 대한 직접적인 참조 줄이기](#하위-클래스에-대한-직접적인-참조-줄이기)
    - [팩토리 메서드 패턴 (factory method pattern)](#팩토리-메서드-패턴-factory-method-pattern)
  - [순환 참조 문제 (책과 별개)](#순환-참조-문제-책과-별개)
  - [검토](#검토)

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
- [ ] 공용 times
- [x] ~~Franc와 Dollar 비교하기~~
- [ ] 통화?

Chapter 8에서는 `Dollar`와 `Franc` 클래스 간에 존재하는 중복 제거에 집중한다.

> 책에서는 `Dollar`와 `Franc`의 `times` 메서드 반환 타입을 각각 `Money` 클래스로 만들지만 여기선 타입스크립트도 사용하고 있지 않고 자바스크립트를 사용하고 있으므로 현재 상태로 놔두고 해당 부분은 넘어가도록 한다.

## 하위 클래스에 대한 직접적인 참조 줄이기

`Dollar`와 `Franc` 클래스에서 `amount` 인스턴스 변수와 `equals` 메서드를 공통 상위 클래스인 `Money` 클래스로 옮기고 나니 두 클래스에서 하는 일이 거의 없다는 걸 알 수 있다. 거의 할 일이 없으면 아예 제거해버리는 건 어떨까?

무언갈 한 번에 제거해버리는 것과 같이 큰 단계는 함부로 밟을 수 없다. TDD를 학습하고 있는 현재는 더욱 더 그러하다.

하위 클래스를 한 번에 제거하는 대신 **하위 클래스에 대한 직접적인 참조를 줄여보자**.

### 팩토리 메서드 패턴 (factory method pattern)

책에서는 하위 클래스에 대한 직접적인 참조를 줄이기 위해 팩토리 메서드 패턴을 이용한다.

---

> **팩토리 메서드 패턴**(**Factory method pattern**)은 객체지향 디자인 패턴이다. Factory method는 부모(상위) 클래스에 알려지지 않은 구체 클래스를 생성하는 패턴이며. 자식(하위) 클래스가 어떤 객체를 생성할지를 결정하도록 하는 패턴이기도 하다. 부모(상위) 클래스 코드에 구체 클래스 이름을 감추기 위한 방법으로도 사용한다.
>
> 출처: [위키백과](https://ko.wikipedia.org/wiki/%ED%8C%A9%ED%86%A0%EB%A6%AC_%EB%A9%94%EC%84%9C%EB%93%9C_%ED%8C%A8%ED%84%B4)

아래는 팩토리 메서드 패턴의 자바스크립트 예제이다.

```javascript
//Our pizzas
function HamAndMushroomPizza() {
  var price = 8.5;
  this.getPrice = function () {
    return price;
  };
}

function DeluxePizza() {
  var price = 10.5;
  this.getPrice = function () {
    return price;
  };
}

function SeafoodPizza() {
  var price = 11.5;
  this.getPrice = function () {
    return price;
  };
}

//Pizza Factory
function PizzaFactory() {
  this.createPizza = function (type) {
    switch (type) {
      case 'Ham and Mushroom':
        return new HamAndMushroomPizza();
      case 'DeluxePizza':
        return new DeluxePizza();
      case 'Seafood Pizza':
        return new SeafoodPizza();
      default:
        return new DeluxePizza();
    }
  };
}

//Usage
var pizzaPrice = new PizzaFactory().createPizza('Ham and Mushroom').getPrice();
alert(pizzaPrice);
```

---

팩토리 메서드 패턴을 도입할 것이기 때문에 Dollar 클래스의 곱하기 연산 검증 테스트 코드를 다음과 같이 변경한다.

```javascript
import Dollar from '../js/Dollar.js';
import Money from '../js/Money.js';

test('Dollar 곱하기 연산 검증', () => {
  const five = Money.dollar(5);

  expect(new Dollar(10).equals(five.times(2))).toBe(true);
  expect(new Dollar(15).equals(five.times(3))).toBe(true);
});
```

`Money` 클래스에 `dollar` 정적 메서드는 아직 존재하지 않으므로 테스트는 당연히 실패한다. 이제 `Money` 클래스에 팩토리 메서드 패턴에 의한 `dollar` 정적 메서드를 구현한다. 이 `dollar` 정적 메서드는 `Dollar` 클래스의 인스턴스를 반환한다.

```javascript
import Dollar from './Dollar';
import Franc from './Franc';

class Money {
  // ...

  static dollar(amount) {
    return new Dollar(amount);
  }
}

export default Money;
```

`Franc` 클래스에 대한 곱하기 연산 검증 그리고 동치성 테스트에 존재하고 있는 하위 클래스에 대한 참조를 팩토리 메서드로 전부 대체한다.

```javascript
// multiplication.test.js
test('Dollar 곱하기 연산 검증', () => {
  const five = Money.dollar(5);

  expect(Money.dollar(10).equals(five.times(2))).toBe(true);
  expect(Money.dollar(15).equals(five.times(3))).toBe(true);
});

// francMultiplication.test.js
test('Franc 곱하기 연산 검증', () => {
  const five = Money.franc(5);

  expect(Money.franc(10).equals(five.times(2))).toBe(true);
  expect(Money.franc(15).equals(five.times(3))).toBe(true);
});

//  equality.test.js
test('생성자 함수 인자에 동일한 값을 전달한 인스턴스는 같아야 한다. 단, 클래스도 동일해야 한다', () => {
  expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
  expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
  expect(Money.franc(5).equals(Money.franc(5))).toBe(true);
  expect(Money.franc(5).equals(Money.franc(6))).toBe(false);
  expect(Money.dollar(5).equals(Money.franc(6))).toBe(false);
});
```

Franc 클래스에 대한 곱하기 연산 검증과 동치성 테스트에 대한 코드도 팩토리 메서드로 변경을 완료했다면 `Franc`에 대한 팩토리 메서드인 정적 메서드 `franc`도 구현한다.

구현을 완료하고 나니 Franc 클래스에 대한 곱하기 연산 검증 테스트 코드를 수정하고 보니 이 테스트에서 얻을 수 있는 검증 결과는 Dollar 클래스에 대한 곱하기 연산 검증 테스트로 모두 얻을 수 있는 것 같다.

이 문제는 현재 Chpater에서 다루고자 하는 것이 아니니 할 일 목록에만 추가해놓고 넘어가자.

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
- [ ] 통화?
- [ ] `francMultiplication.test.js`를 지워야 할까?

## 순환 참조 문제 (책과 별개)

주의할 점은 현재 코드 구조 상 `Money` 클래스에 `Dollar` 클래스를 `import` 해오는 순간 순환 참조 문제가 발생한다. 예를 들어, `Money` > `Dollar` > `Money` > ...

이는 모듈이 로딩되는 순서가 근본적인 원인이다.

1. `Money.js` 파일 상단의 `import` 구문을 읽고 `Dollar.js` 파일을 읽기 시작한다.
2. `Dollar.js` 파일 상단에는 `Money.js` 파일에 대한 `import` 구문이 존재하기에 `Money.js` 파일을 읽는다.
3. `Money.js` 파일은 이미 로드된 상태이므로 모듈 캐시에서 즉시 반환해준다.

   문제는 `Money.js` 파일을 로드할 때 첫 번째 줄을 읽고 `Dollar.js` 파일로 넘어온 상태기 때문에 `Money` 클래스의 구현부는 아직 실행되지 않았다.

4. `Dollar.js`는 제대로된 클래스가 아니라 `undefined`를 반환받게 되고 `undefined`를 상속하려고 하기 때문에 다음과 같이 오류가 발생한다.

   `TypeError: Class extends value undefined is not a constructor or null`

순환 참조를 끊을 방법은 여러 가지가 있겠지만 책의 예제에서 크게 수정하지 않으면서 조그마한 프로젝트에서 사용해볼 수 있는 **internal module**, [내부 모듈 패턴](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de)을 사용해본다.

이 패턴의 주요 규칙은 다음과 같다.

1. `internal.js` 모듈은 프로젝트 전체의 로컬 모듈을 불러모은 다음 전부 내보내는 역할을 한다.
2. 다른 모듈들은 모두 반드시 `internal.js` 파일만 불러와서 사용한다. 다른 모듈을 직접적으로 불러오지 않도록 한다.

이러면 1차적으로 처음 `internal.js`를 읽은 곳은 모듈 캐시에서 `undefined`를 반환받겠지만 해당 클래스들이 실질적으로 필요한 `Money`, `Dollar`, `Franc` 클래스에서는 `undefined`를 반환받지 않고 정상적으로 각 클래스를 참조할 수 있게 된다.

> 여기선 책의 예제의 코드 및 구조를 크게 벗어나고 싶지 않기 때문에(클래스들을 하나의 파일로 모으는 등) 내부 모듈 패턴을 사용했지만 실제 실무 프로젝트에서 이 패턴을 사용할 것 같지는 않다.
>
> 코드를 작성하는 흐름이 평소와 조금 다르게 변하기도 하고 순환 참조를 아예 발생시키지 않게 코드를 분리하는 쪽으로 선택하는게 나아보이기 때문이다. 웹팩에서 플러그인을 제공하여 순환 참조를 검출할 수도 있으니 순환 참조의 원인을 제거하는 전략을 가져가는게 좋아보인다.

## 검토

- 팩토리 메서드를 도입하여 테스트 코드에서 하위 클래스의 존재 사실을 분리해냈다.
- 하위 클래스가 사라지면 몇몇 테스트는 불필요한 여분의 테스트가 된다는 것을 확인했다.
