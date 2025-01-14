import { resize } from './hashmap';

describe('resize', () => {
  let hashMap: any;

  beforeEach(() => {
    hashMap = {
      slots: [],
      capacity: 0,
      threshold: 0,
    };
  });

  test('should return oldSlots when oldCapacity is greater than or equal to MAXIMUM_CAPACITY', () => {
    hashMap.capacity = MAXIMUM_CAPACITY;

    const result = resize.call(hashMap);

    expect(result).toEqual(hashMap.slots);
  });

  test('should set newThreshold and newCapacity when oldCapacity is less than MAXIMUM_CAPACITY and greater than or equal to DEFAULT_INITIAL_CAPACITY', () => {
    hashMap.capacity = DEFAULT_INITIAL_CAPACITY + 1;

    resize.call(hashMap);

    expect(hashMap.threshold).toEqual(hashMap.capacity << 1);
  });

  test('should set newCapacity and newThreshold when oldThreshold is greater than 0', () => {
    hashMap.threshold = 10;

    resize.call(hashMap);

    expect(hashMap.capacity).toEqual(hashMap.threshold);
    expect(hashMap.threshold).toEqual(Math.floor(hashMap.capacity * DEFAULT_LOAD_FACTOR));
  });

  test('should set default values when oldCapacity and oldThreshold are 0', () => {
    resize.call(hashMap);

    expect(hashMap.capacity).toEqual(DEFAULT_INITIAL_CAPACITY);
    expect(hashMap.threshold).toEqual(Math.floor(DEFAULT_INITIAL_CAPACITY * DEFAULT_LOAD_FACTOR));
  });

  test('should copy nodes to newSlots when oldSlots is not empty', () => {
    hashMap.slots = [
      {
        get: jest.fn().mockReturnValueOnce({
          hashCode: jest.fn().mockReturnValue(1),
          getKey: jest.fn().mockReturnValue('key1'),
          getValue: jest.fn().mockReturnValue('value1'),
        }),
      },
    ];

    resize.call(hashMap);

    expect(hashMap.slots[0]).toHaveBeenCalledTimes(1);
  });

  test('should set newIndex and newNode in newSlots when copying nodes', () => {
    hashMap.slots = [
      {
        get: jest.fn().mockReturnValueOnce({
          hashCode: jest.fn().mockReturnValue(1),
          getKey: jest.fn().mockReturnValue('key1'),
          getValue: jest.fn().mockReturnValue('value1'),
        }),
      },
    ];

    resize.call(hashMap);

    expect(hashMap.slots.set).toHaveBeenCalledTimes(2);
  });

  test('should handle nodes with next pointers when copying nodes', () => {
    hashMap.slots = [
      {
        get: jest.fn().mockReturnValueOnce({
          hashCode: jest.fn().mockReturnValue(1),
          getKey: jest.fn().mockReturnValue('key1'),
          getValue: jest.fn().mockReturnValue('value1'),
          next: {
            hashCode: jest.fn().mockReturnValue(2),
            getKey: jest.fn().mockReturnValue('key2'),
            getValue: jest.fn().mockReturnValue('value2'),
          },
        }),
      },
    ];

    resize.call(hashMap);

    expect(hashMap.slots.set).toHaveBeenCalledTimes(3);
  });

  test('should update slots and return newSlots', () => {
    hashMap.slots = [
      {
        get: jest.fn().mockReturnValueOnce({
          hashCode: jest.fn().mockReturnValue(1),
          getKey: jest.fn().mockReturnValue('key1'),
          getValue: jest.fn().mockReturnValue('value1'),
        }),
      },
    ];

    const result = resize.call(hashMap);

    expect(hashMap.slots).toEqual(result);
  });
});