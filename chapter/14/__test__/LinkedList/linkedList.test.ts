import LinkedList from '../../ts/LinkedList';
import Node from '../../ts/LinkedList/Node';
import Pair from '../../ts/Pair';
import { CURRENCY } from '../../ts/constants';

describe('LinkedList 인스턴스 검증', () => {
  test('LinkedList가 비어 있을 때의 add 연산', () => {
    const pair = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const node = new Node(pair, 2);

    const linkedList = new LinkedList();

    expect(linkedList.contains(node)).toBe(false);

    linkedList.add(node);

    expect(linkedList.contains(node)).toBe(true);
    expect(node.equals(linkedList.first)).toBe(true);
    expect(node.equals(linkedList.last)).toBe(true);
    expect(linkedList.length).toBe(1);
  });

  test('LinkedList 비어 있지 않을 때의 add 연산', () => {
    const pair = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const linkedList = new LinkedList();
    const node1 = new Node(pair, 2);
    const node2 = new Node(pair, 4);

    linkedList.add(node1);
    linkedList.add(node2);

    expect(linkedList.contains(node1)).toBe(true);
    expect(linkedList.contains(node2)).toBe(true);
    expect(node1.equals(linkedList.first)).toBe(true);
    expect(node2.equals(linkedList.last)).toBe(true);
    expect(linkedList.length).toBe(2);
  });
});
