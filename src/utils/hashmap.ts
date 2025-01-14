import { IllegalArgumentException } from "./exceptions";

interface WithHashCode {
  hashCode(): number;
}

type WithEquals = {
  equals(obj: any): boolean;
}

type MapEntryKey = string | number | symbol | WithHashCode;

class MapNode<K extends MapEntryKey, V> {
  protected readonly key: K;
  protected hash: number;
  protected value: V;
  next: MapNode<K, V> | null;
  constructor(hash: number, key: K, value: V, next?: MapNode<K, V>) {
    this.hash = hash;
    this.key = key;
    this.value = value;
    this.next = next || null;
  }
  getKey(): K {
    return this.key;
  }
  getValue(): V {
    return this.value;
  }
  setValue(value: V): V {
    let oldValue = this.value;
    this.value = value;
    return oldValue;
  }
  hashCode(): number {
    return this.hash;
  }
}

class TreeNode<K extends MapEntryKey, V> extends MapNode<K, V> {
  protected left: TreeNode<K, V> | null;
  protected right: TreeNode<K, V> | null;
  protected parent: TreeNode<K, V> | null;
  protected isRed: boolean = false;
  readonly isTreeNode: boolean = true;
  constructor(hash: number, key: K, value: V, 
    next?: MapNode<K, V>, left?: TreeNode<K, V>, 
    right?: TreeNode<K, V>, 
    parent?: TreeNode<K, V>) {
    super(hash, key, value, next);
    this.left = left || null;
    this.right = right || null;
    this.parent = parent || null;
  }
  split(slots: HashMapSlots<K, V>, index: number): void {
    let node: TreeNode<K, V> = this;
    let loHead: TreeNode<K, V> | null = null;
    let loTail: TreeNode<K, V> | null = null;
    let hiHead: TreeNode<K, V> | null = null;
    let hiTail: TreeNode<K, V> | null = null;
    let lc: number = 0;
    let hc: number = 0;

  }
}

const DEFAULT_INITIAL_CAPACITY: number = 1 << 4;
const MAXIMUM_CAPACITY: number = 1 << 30;
const DEFAULT_LOAD_FACTOR: number = 0.75;

class HashMapSlots<K extends MapEntryKey, V> {
  private slots: {[key: number]: MapNode<K, V> | null}
  private _length: number = 0;
  private keySet: K[] = [];
  private valueSet: V[] = [];
  readonly capacity: number = 0;
  constructor(capacity: number) {
    this.slots = {};
    this.capacity = capacity;
    for (let i = 0; i < capacity; i++) {
      this.slots[i] = null;
    }
  }
  get(index: number): MapNode<K, V> | null {
    return this.slots[index];
  }
  set(index: number, node: MapNode<K, V> | null): void {
    this.slots[index] = node;
    if (node) {
      this.keySet.push(node.getKey());
      this.valueSet.push(node.getValue());
      this._length++;
    }
  }
  remove(index: number): void {
    this.slots[index] = null;
    this._length--;
  }
  getkeys(): K[] {
    return this.keySet;
  }
  getvalues(): V[] {
    return this.valueSet;
  }
  get length(): number {
    return this._length;
  }
}

class HashMap<K extends MapEntryKey, V> implements Map<K, V> {
  private slots: HashMapSlots<K, V>;
  private threshold: number = 0;
  private capacity: number = 0;
  private _size: number = 0;
  constructor(initialCapacity?: number, loadFactor?: number) {
    if (initialCapacity) {
      if(initialCapacity < 0)
        throw new IllegalArgumentException("initial capacity", initialCapacity);
      this.capacity = DEFAULT_INITIAL_CAPACITY;
    }
    if (loadFactor && loadFactor <= 0) {
      throw new IllegalArgumentException("load factor", loadFactor);
    }else if (!loadFactor) {
      loadFactor = DEFAULT_LOAD_FACTOR;
    }
    // this.threshold = Math.floor(initialCapacity * loadFactor);
    this.slots = this.resize();
  }
  get size(): number {
    return this._size;
  }
  hash(key: K): number {
    let hash = 0;
    if (typeof key === 'string') {
      for (let i = 0; i < key.length; i++) {
        hash = 31 * hash + key.charCodeAt(i);
      }
    } else if (typeof key === 'number') {
      hash = key; // 直接使用数字作为哈希值
    } else if (<WithHashCode>key && (<WithHashCode>key).hashCode) {
      hash = (<WithHashCode>key).hashCode();
    } else {
      hash = key.toString().split('').reduce((prev, curr) => {
        return prev * 31 + curr.charCodeAt(0);
      }, 0);
    }
    return hash ^ (hash >>> 16);
  }
  isEmpty(): boolean {
    return this.size === 0;
  }
  private resize(): HashMapSlots<K, V> {
    let oldSlots = this.slots;
    let oldCapacity = this.capacity;
    let oldThreshold = this.threshold;
    let newCapacity = 0;
    let newThreshold = 0;
    if(oldCapacity > 0) {
      if(oldCapacity >= MAXIMUM_CAPACITY) {
        this.threshold = Number.MAX_VALUE;
        return oldSlots;
      }else if ((oldCapacity << 1) < MAXIMUM_CAPACITY 
        && oldCapacity >= DEFAULT_INITIAL_CAPACITY) {
        newThreshold = oldCapacity << 1;
      }
    }
    else if(oldThreshold > 0) {
      newCapacity = oldThreshold;
    }else {
      newCapacity = DEFAULT_INITIAL_CAPACITY;
      newThreshold = Math.floor(DEFAULT_INITIAL_CAPACITY * DEFAULT_LOAD_FACTOR);
    }
    this.threshold = newThreshold;
    let newSlots = new HashMapSlots<K, V>(newCapacity);
    this.slots = newSlots;
    if (oldSlots && oldSlots.length > 0) {
      for (let i = 0; i < oldSlots.length; i++) {
        let node = oldSlots.get(i);
        oldSlots.remove(i);
        if (node) {
          // 重新计算哈希值
          if(node.next === null) {
            let newIndex = newCapacity - 1 & node.hashCode();
            newSlots.set(newIndex, node);
          }else if ((<TreeNode<K, V>>node).isTreeNode) {
            // 红黑树
            //let treeNode = <TreeNode<K, V>>node;
            //let newIndex = newCapacity - 1 & treeNode.hashCode();
            //newSlots.set(newIndex, treeNode);
          }else {
            // 链表
            let loHead: MapNode<K, V> | null = null;
            let loTail: MapNode<K, V> | null = null;
            let hiHead: MapNode<K, V> | null = null;
            let hiTail: MapNode<K, V> | null = null;
            let next: MapNode<K, V> | null = null;
            while (node.next) {
              next = node.next;
              if(node.hashCode() & oldCapacity) {
                if(hiTail === null) {
                  hiHead = node;
                }else {
                  hiTail.next = node;
                }
                hiTail = node;
              }else {
                if(loTail === null) {
                  loHead = node;
                }else {
                  loTail.next = node;
                }
                loTail = node;
              }
              node = next;
            }
            // num % 2^n == num & (2^n - 1)
            // capacity of slots is 2^n
            if (loTail != null) {
              loTail.next = null;
              newSlots.set(i, loHead);
            }
            if (hiTail != null) {
              hiTail.next = null;
              newSlots.set(i + oldCapacity, hiHead);
            }
          }
        }
      }
    }
    return newSlots;
  }
  clear(): void {
    let slots = this.slots;
    if (slots && slots.length > 0) {
      for (let i = 0; i < slots.length; i++) {
        slots.remove(i);
      }
    }
  }
  delete(key: K): boolean {
    throw new Error("Method not implemented.");
  }
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    throw new Error("Method not implemented.");
  }
  get(key: K): V | undefined {
    let slots = new HashMapSlots<K, V>(this.slots.length);
    if (key === null || key === undefined) {
      return undefined;
    }
    if (slots && slots.length > 0) {
      let n = slots.length - 1;
      let hash = this.hash(key);
      let index = n & hash;
      let node = slots.get(index);
      if (!node) {
        return undefined;
      }
      if (node.hashCode() === hash && node.getKey() === key) {
        return node.getValue();
      }
      while (node.next) {
        node = node.next;
        if (node.hashCode() === hash && node.getKey() === key) {
          return node.getValue();
        }
      }
    }
    return undefined;
  }
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }
  set(key: K, value: V): this {
    let slots = this.slots;
    if (key === null || key === undefined) {
      throw new IllegalArgumentException("key", key);
    }
    if(!slots.length) {
      slots = this.resize();
    }
    let n = slots.length;
    let hash = this.hash(key);
    let i = n - 1 & hash;
    let p: MapNode<K, V> | null = slots.get(i);
    if(p === null) {
      // if first node
      slots.set(i, new MapNode<K, V>(hash, key, value));
    }else {
      // on hash collision
      let e: MapNode<K, V> | null = null;
      let k: K;
      if(p.hashCode() === this.hash(key) && p.getKey() === key) {
        // if key is same, replace node
        e = p;
      }else if(<TreeNode<K, V>>p && (<TreeNode<K, V>>p).isTreeNode) {
        // 红黑树
        //let treeNode = <TreeNode<K, V>>p;
        //e = treeNode.putTreeVal(this.hash(key), key, value);
      }else if(p.next) {
        // iterate linked list to find node with target key
        while(p.next) {
          p = p.next;
          if(p.hashCode() === this.hash(key) && p.getKey() === key) {
            e = p;
            break;
          }
        }
      }
      if(e) {
        let oldValue = e.getValue();
        e.setValue(value);
        return this;
      }else {
        p.next = new MapNode<K, V>(this.hash(key), key, value);
      }
      if(++this._size > this.threshold) {
        this.resize();
      }
    }
    return this;
  }
  entries(): IterableIterator<[K, V]> {
    throw new Error("Method not implemented.");
  }
  keys(): IterableIterator<K> {
    return this.slots.getkeys()[Symbol.iterator]();
  }
  values(): IterableIterator<V> {
    return this.slots.getvalues()[Symbol.iterator]();
  }
  [Symbol.iterator](): IterableIterator<[K, V]> {
    throw new Error("Method not implemented.");
  }
  get [Symbol.toStringTag](): string {
    throw new Error("Method not implemented.");
  }
}

export type {
  WithHashCode,
  MapEntryKey
}

export {
  HashMapSlots,
  MapNode,
  TreeNode,
  HashMap
}