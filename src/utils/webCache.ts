import { WithHashCode } from "./hashmap";
import stringUtils from "./stringUtils";

const localCache = localStorage;

export const CACHE_KEY: {[key: string]: string} = {
  // 用户相关
  ROLE_ROUTERS: 'roleRouters',
  USER: 'user',
  // 系统设置
  IS_DARK: 'isDark',
  LANG: 'lang',
  THEME: 'theme',
  LAYOUT: 'layout',
  DICT_CACHE: 'dictCache',
  // 登录表单
  LoginForm: 'loginForm',
  TenantId: 'tenantId',
  AuthToken: 'authToken'
}

class WebCacheKey implements WithHashCode {
  private _key: string
  constructor(key: keyof typeof CACHE_KEY) {
    this._key = CACHE_KEY[key];
  }
  hashCode(): number {
    return stringUtils.hashCode(this._key);
  }
  equals(obj: any): boolean {
    if(obj instanceof WebCacheKey) {
      return this._key === obj._key;
    }
    return false;
  }
  getKey(): string {
    return this._key;
  }
}

class WebCacheBase {
  key: string;
  // ensures the key is always unique and exists
  constructor(key: WebCacheKey) {
    this.key = key.getKey();
  }
  exists(): boolean {
    return localCache.getItem(this.key) !== null;
  }
  clear(): void {
    localCache.removeItem(this.key);
  }
  get(): string | null {
    return localCache.getItem(this.key);
  }
  set(val: string): void {
    localCache.setItem(this.key, val);
  }
}

export {
  WebCacheKey,
  WebCacheBase
}