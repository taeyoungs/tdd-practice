# Chpater 5 - 솔직히 말하자면

**목차**

- [Chpater 5 - 솔직히 말하자면](#chpater-5---솔직히-말하자면)
  - [개요](#개요)
  - [`Franc` 클래스](#franc-클래스)
  - [5CHF x 2 = 10CHF](#5chf-x-2--10chf)
  - [검토](#검토)

## 개요

Chapter 4까지 진행하고 난 뒤의 할 일 목록은 다음과 같다.

- [ ] $5 + 10CHF = $10 (환율이 2:1일 경우)
- [x] ~~$5 x 2 = $10~~
- [x] ~~`amount`를 `private`으로 만들기~~
- [x] ~~`Dollar` 부작용 ?~~
- [ ] `Money` 반올림 ?
- [x] ~~equals()~~
- [ ] hashCode()
- [ ] Equal null
- [ ] Equal object

여기서 첫 번재 할 일 항목을 해결하려면 어떻게 하는게 좋을까?

## `Franc` 클래스

처음부터 모든 걸 하려고 하지 말고 보이는 것부터 하나씩 정복해 나가보자.  
우선은 `Dollar` 객체와 비슷하지만 달러 대신 프랑(`Franc`)을 표현할 수 있는 객체가 필요할 것 같고 `Dollar`의 `multiplication` 테스트도 진행할 수 있으면 좋을 것 같다.

`Dollar`의 `multiplication` 테스트를 복사한 후 수정해보자.

```javascript
test('Franc 곱하기 연산 검증', () => {
  const five = new Franc(5);

  expect(new Franc(10).equals(five.times(2))).toBe(true);
  expect(new Franc(15).equals(five.times(3))).toBe(true);
});
```

복사와 붙여넣기를 진행해서 꺼림칙함이 느껴질 수도 있겠지만 이러한 꺼림칙함을 잠시 묻어두고 TDD의 사이클을 다시 한번 떠올려보자.

1. 테스트 작성
2. 컴파일되게 하기
3. 실패하는지 확인하기 위해 실행
4. 실행하게 만듦
5. 중복 제거

위 사이클 중 처음 네 단계는 빨리 진행해야 한다.  
이때 네 번째 단계까지 도달하기 위해 어떤 죄악이든 저지를 수 있는데 이는 이 과정만큼은 속도가 설계보다 더 높은 우선 순위를 가지기 때문이다.

이 말만 보면 설계는 모두 집어 치우고 속도만을 고려하여 TDD 사이클을 돌면 된다! 라고 생각할 수도 있지만 .. **아직! 사이클은 끝나지 않았다.**  
사이클의 마지막 단계, 중복 제거가 없이는 앞의 네 단계는 제대로 이루어지지 않는다.

**적절한 시기에 적잘한 설계를 돌아가게 만들고 올바르게 만들어야 한다.**

다시 돌아와서 `Dollar` 클래스를 복사한 후 수정하여 `Franc` 클래스를 만들어 보자.

```javascript
class Franc {
  #amount;

  constructor(amount) {
    this.#amount = amount;
  }

  get amount() {
    return this.#amount;
  }

  times(multiplier) {
    return new Franc(this.#amount * multiplier);
  }

  equals(instance) {
    return this.#amount === instance.amount;
  }
}

export default Franc;
```

## 5CHF x 2 = 10CHF

할 일 목록을 업데이트 해보자.

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
- [ ] 공용 equals
- [ ] 공용 times

위에서 `Dollar`의 `multiplication` 테스트를 복사하여 수정하여 `Franc`의 `multiplication` 테스트를 만들었고 이 테스트를 통과하기 위하여 `Dollar` 클래스를 복사하여 수정한 `Franc` 클래스를 구현했다.

이로써 할 일 목록의 첫 번째 항목을 해결하진 못했지만 첫 번째 항목을 해결하기 위한 다른 항목들을 생성하고 이를 해결했다.  
단, 테스트와 클래스를 복사하여 수정했기 때문에 중복이 엄청나게 많다. 다음 테스트를 진행하기 전에 이러한 중복을 먼저 해결해야 한다.

## 검토

- 큰 테스트를 공략할 수 없다. 그래서 진전을 나타낼 수 있는 자그마한 테스트를 만들었다.
- 뻔뻔스럽게도 중복을 만들고 조금 고쳐서 테스트를 작성했다.
- 설상가상으로 모델(`Dollar`) 코드까지 복사하고 수정하여 `Franc` 모델을 만든 뒤 이를 이용해 테스트를 통과했다.
- 아직 사이클은 끝나지 않았다(중복을 제거하기 위한 마지막 단계가 남았다).
