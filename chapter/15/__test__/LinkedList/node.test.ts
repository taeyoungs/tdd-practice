import Node from '15/ts/LinkedList/Node';
import Pair from '15/ts/Pair';

import { CURRENCY } from '15/ts/constants';

describe('Node 인스턴스 검증', () => {
  test('Node 인스턴스는 특정 Pair에 value를 저장하고 이를 반환받을 수 있어야 한다.', () => {
    const pair = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const node = new Node(pair, 2);

    expect(node.value).toBe(2);
  });

  test('Node 인스턴스는 next에 자신의 다음 Node를 저장할 수 있어야 한다.', () => {
    const pair1 = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const pair2 = new Pair(CURRENCY.DOLLAR, CURRENCY.FRANC);
    const node1 = new Node(pair1, 2);
    const node2 = new Node(pair2, 3);

    node1.next = node2;

    expect(node2.equals(node1.next)).toBe(true);
  });

  test('Node 인스턴스는 값을 수정할 수 있어야 한다.', () => {
    const pair = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const node = new Node(pair, 2);

    node.value = 4;

    expect(node.value).toBe(4);
  });

  test('같은 Pair를 갖는 Node는 같아야 한다.', () => {
    const pair = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const node1 = new Node(pair, 2);
    const node2 = new Node(pair, 3);

    expect(node1.equals(node2)).toBe(true);
  });

  test('다른 Pair를 갖는 Node는 달라야 한다.', () => {
    const pair1 = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const pair2 = new Pair(CURRENCY.DOLLAR, CURRENCY.FRANC);
    const node1 = new Node(pair1, 2);
    const node2 = new Node(pair2, 2);

    expect(node1.equals(null)).toBe(false);
    expect(node1.equals(node2)).toBe(false);
  });
});
