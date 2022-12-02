# Chapter 7 - 사과와 오렌지

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
- [ ] Dollar/Franc 중복
- [x] ~~공용 equals~~
- [ ] 공용 times
- [ ] **Franc와 Dollar 비교하기**

Chapter 6가 끝나갈 때 마지막으로 추가했던 할 일 항목인 **Franc와 Dollar 비교하기**에 대해 이야기해보자.

현재 상황에서 `Franc`와 `Dollar`에 대한 동치성 테스트를 추가하면 어떻게 될까?

```javascript
import Dollar from '../js/Dollar';
import Franc from '../js/Franc';

test('생성자 함수 인자에 동일한 값을 전달한 인스턴스는 같아야 한다.', () => {
  expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
  expect(new Dollar(5).equals(new Dollar(6))).toBe(false);
  expect(new Franc(5).equals(new Franc(5))).toBe(true);
  expect(new Franc(5).equals(new Franc(6))).toBe(false);
  expect(new Dollar(5).equals(new Franc(6))).toBe(false);
});
```

**테스트가 통과한다.**

`Dollar`가 `Franc`과 같다는건 말이 되지 않는다. 따라서, 동치성 코드에 '`Dollar`와 `Franc`의 비교'와 같은 케이스를 검사하는 코드가 추가되어야 한다.

두 객체의 클래스를 비교함으로써 이러한 검사를 진행할 수 있다. 오직 금액과 클래스가 같아야만 이 두 화폐가 동일한 것이다.

## 두 객체의 클래스를 비교

```javascript
class Money {
  // ...

  equals(instance) {
    const isSameConstructor = this.constructor === instance.constructor;

    return this.amount === instance.amount && isSameConstructor;
  }
}

export default Money;
```

위 코드를 통해 두 객체의 클래스를 비교하고 금액과 클래스가 같아야만 두 화폐가 동일하다고 체크되도록 만들었다.

자바스크립트의 용어를 사용하는 것보다 재정과 관련된 용어를 사용하는 것이 더 바람직해 보이지만 현재는 통화 개념을 도입할 이유가 충분하지 않으므로 우선 이 상태로 두고 넘어간다.

할 일 항목 하나를 해결했으니 목록을 업데이트하자.

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

## 검토

- 결함을 끄집어내서 테스트에 추가했다.
- 완벽하진 않지만 그럭저럭 봐줄 만한 방법으로 테스트를 통과하게 만들었다.
- 더 많은 동기가 있기 전에는 더 많은 설계를 도입하지 않기로 했다.
