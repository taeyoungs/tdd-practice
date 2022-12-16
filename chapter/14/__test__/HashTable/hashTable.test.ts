import Pair from '../../ts/Pair';
import HashTable from '../../ts/HashTable';

import { CURRENCY } from '../../ts/constants';

describe('HashTable 인스턴스 검증', () => {
  test('HashTable은 특정 hash 키에 value를 추가할 수 있어야 한다.', () => {
    const pair1 = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);
    const pair2 = new Pair(CURRENCY.DOLLAR, CURRENCY.FRANC);

    const hashTable = new HashTable();

    hashTable.put(pair1, 2);

    expect(hashTable.get(pair1)).toBe(2);
    expect(hashTable.get(pair2)).toBeNull();

    hashTable.put(pair2, 4);
    expect(hashTable.get(pair2)).toBe(4);
  });

  test('HashTable은 특정 hash 키에 value를 수정할 수 있어야 한다.', () => {
    const pair = new Pair(CURRENCY.FRANC, CURRENCY.DOLLAR);

    const hashTable = new HashTable();

    hashTable.put(pair, 2);

    expect(hashTable.get(pair)).toBe(2);

    hashTable.put(pair, 4);

    expect(hashTable.get(pair)).toBe(4);
  });
});
