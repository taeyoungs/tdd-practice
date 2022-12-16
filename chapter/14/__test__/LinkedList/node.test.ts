import Node from '../../ts/LinkedList/Node';

describe('Node 인스턴스 검증', () => {
  test('Node 인스턴스는 value 값을 저장하고 있어야 한다.', () => {
    const node = new Node(5);

    expect(node.value).toBe(5);
  });

  test('동일한 value를 가진 Node 인스턴스는 같아야 한다.', () => {
    const node1 = new Node(5);
    const node2 = new Node(5);

    expect(node1.equals(node2)).toBe(true);
  });

  test('Node 인스턴스는 next에 자신의 다음 Node를 저장할 수 있어야 한다.', () => {
    const node1 = new Node(5);
    const node2 = new Node(10);

    node1.next = node2;

    expect(node1.next.value).toBe(10);
  });
});
