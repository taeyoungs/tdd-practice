import Node from '../../ts/LinkedList/Node';
import LinkedList from '../../ts/LinkedList';

describe('LinkedList 인스턴스 검증', () => {
  test('LinkedList가 비어 있을 때의 add 연산', () => {
    const linkedList = new LinkedList<number>();
    const node1 = new Node(5);

    expect(linkedList.contains(node1)).toBe(false);

    linkedList.add(node1);

    expect(linkedList.contains(node1)).toBe(true);
    expect(node1.equals(linkedList.first)).toBe(true);
    expect(node1.equals(linkedList.last)).toBe(true);
    expect(linkedList.length).toBe(1);
  });

  test('LinkedList 비어 있지 않을 때의 add 연산', () => {
    const linkedList = new LinkedList<number>();
    const node1 = new Node(5);
    const node2 = new Node(10);

    linkedList.add(node1);
    linkedList.add(node2);

    expect(linkedList.contains(node1)).toBe(true);
    expect(linkedList.contains(node2)).toBe(true);
    expect(node1.equals(linkedList.first)).toBe(true);
    expect(node2.equals(linkedList.last)).toBe(true);
    expect(linkedList.length).toBe(2);
  });
});
