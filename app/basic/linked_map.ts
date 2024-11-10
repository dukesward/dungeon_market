class LinkedMap<K, V> {
  private _k: K;
  private _v: V;
  private _s: string;
  private _o: number;
  private _next?: LinkedMap<K, V> | null;
  private _prev?: LinkedMap<K, V> | null;
  constructor(k: K, v: V, s: string, o: number) {
    this._k = k;
    this._v = v;
    this._s = s;
    this._o = o;
  }
  is (k: K) {
    return this._k === k;
  }
  get key () {
      return this._k;
  }
  get val () {
      return this._v;
  }
  get scope () {
    return this._s;
  }
  get order () {
    return this._o;
  }
}

export default LinkedMap;