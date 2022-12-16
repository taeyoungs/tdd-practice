import LinkedList from '../../ts/LinkedList';
import Node from '../../ts/LinkedList/Node';
import Pair from '../../ts/Pair';

import { CURRENCY } from '../../ts/constants';

describe('LinkedList 인스턴스 검증', () => {
  test('LinkedList는 비어 있을 때의 Node를 추가할 수 있어야 한다.', () => {
    const pair = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const node = new Node(pair, 2);

    const linkedList = new LinkedList();

    linkedList.add(node);

    expect(node.equals(linkedList.first)).toBe(true);
    expect(node.equals(linkedList.last)).toBe(true);
    expect(linkedList.length).toBe(1);
  });

  test('LinkedList 비어 있지 않을 때 Node를 추가할 수 있어야 한다.', () => {
    const pair = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const node1 = new Node(pair, 2);
    const node2 = new Node(pair, 4);

    const linkedList = new LinkedList();

    linkedList.add(node1);
    linkedList.add(node2);

    expect(node1.equals(linkedList.first)).toBe(true);
    expect(node2.equals(linkedList.last)).toBe(true);
    expect(linkedList.length).toBe(2);
  });

  test('LinkedList에 특정 키를 가진 Node의 존재 유무를 알 수 있어야 한다.', () => {
    const pair1 = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const pair2 = new Pair(CURRENCY.DOLLAR, CURRENCY.FRANC);
    const node1 = new Node(pair1, 2);
    const node2 = new Node(pair2, 4);

    const linkedList = new LinkedList();

    linkedList.add(node1);

    expect(linkedList.contains(node1)).toBe(true);
    expect(linkedList.contains(node2)).toBe(false);
  });

  test('LinkedList는 특정 키를 가진 Node의 값를 얻을 수 있어야 한다.', () => {
    const pair1 = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const pair2 = new Pair(CURRENCY.DOLLAR, CURRENCY.FRANC);
    const node = new Node(pair1, 2);

    const linkedList = new LinkedList();

    linkedList.add(node);

    const value1 = linkedList.get(pair1);
    const value2 = linkedList.get(pair2);

    expect(value1).toBe(2);
    expect(value2).toBeNull();
  });

  test('LikedList는 특정 키를 가진 Node의 값을 수정할 수 있어야 한다.', () => {
    const pair1 = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const pair2 = new Pair(CURRENCY.DOLLAR, CURRENCY.FRANC);
    const node = new Node(pair1, 2);

    const linkedList = new LinkedList();

    linkedList.add(node);

    linkedList.set(pair1, 4);

    expect(linkedList.get(pair1)).toBe(4);

    expect(() => linkedList.set(pair2, 4)).toThrow(new ReferenceError('Pair does not exist'));
  });
});
