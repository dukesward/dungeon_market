import { Observable, tap } from "rxjs";
import apiServiceDelegator from "./components/ApiServiceDelegator";
import { ErrorMessageWrapper, ServiceCallError, SimpleMap, TenantIdResponse } from "./layouts/types";
import { AppLogger, AppLoggerImpl } from "./utils/logger";
import { CACHE_KEY, WebCacheBase, WebCacheKey } from "./utils/webCache";
import { HashMap } from "./utils/hashmap";

const env = require('./env.json');
const env_configs = env['APP_ENV_CONFIGS'][env['APP_ENV']];

const logger: AppLogger = new AppLoggerImpl();

class AppContext {
  private appConstants: SimpleMap<SimpleMap<string>> = {}
  private errorMessages: ErrorMessageWrapper[] = []
  private stateHooks: {[key: string]: (data: any) => void} = {}
  private webCacheMap: Map<WebCacheKey, WebCacheBase> = new HashMap<WebCacheKey, WebCacheBase>();
  initialize(
    callback?: () => void,
    errorHandle?: (err: any) => void) {
    apiServiceDelegator.getService(
      'error_code_constants',
      { 'app_locale_id': appContext.envVar('APP_LOCALE_ID') }
    ).subscribe({
      next: (data: SimpleMap<string>) => {
        if(data) {
          // 初始化错误码
          this.appConstants['error_code'] = data;
        }
        callback && callback();
      },
      error: error => {
        console.log(error);
        if(error) {
          errorHandle && errorHandle(error);
        }
      }
    });
    console.log('appContext initialized');
  }
  async validateToken(): Promise<boolean> {
    let cache: WebCacheBase | null = this.getWebCache("AuthToken");
    if(cache && cache.exists()) {
      return true;
    }else {
      return false;
    }
  }
  envVar(name: string): string {
    return env[name] || env_configs[name];
  }
  envConfigs(): any {
    return env_configs;
  }
  getWebCache(key: keyof typeof CACHE_KEY): WebCacheBase | null {
    let cacheKey: WebCacheKey = new WebCacheKey(key);
    if(this.webCacheMap.has(cacheKey)) {
      return this.webCacheMap.get(cacheKey)!;
    }
    return null;
  }
  setWebCache(key: string, val: string): WebCacheBase {
    let cacheKey: WebCacheKey = new WebCacheKey(key);
    let cache: WebCacheBase = new WebCacheBase(cacheKey);
    this.webCacheMap.set(cacheKey, cache);
    return cache;
  }
  getConstant(type: string, key: string): string | null {
    return this.appConstants[type] ? this.appConstants[type][key] : null;
  }
  hookState(key: string, val: (data: any) => void): void {
    this.stateHooks[key] = val;
  }
  handleServiceCallError(e: ServiceCallError) {
    if(this.stateHooks['error_message']) {
      this.stateHooks['error_message'](e);
    }
  }
  getTenantId(params?: any): Observable<TenantIdResponse> {
    let cache: WebCacheBase | null = this.getWebCache("TenantId");
    if(cache !== null && cache.exists()) {
      return new Observable<TenantIdResponse>(observer => {
        observer.next({
          code: 0,
          data: parseInt(cache!.get()!),
          msg:'success'
        });
        observer.complete();
      });
    }else {
      return apiServiceDelegator.getService(
        'tenant_id',
        params || {}
      ).pipe(
        tap((data: TenantIdResponse) => {
          this.setWebCache('TenantId', data.data.toString());
        })
      );
    }
  }
  isPostLogin(): boolean {
    let cache: WebCacheBase | null = this.getWebCache("AuthToken");
    if(!cache || !cache.exists())
      return false;
    try {
      let tokenData = JSON.parse(cache.get()!);
      if(tokenData.expiresTime < Date.now()) {
        logger.warn('token expired');
        return false;
      }
    }catch(e) {
      return false;
    }
    return true;
  }
}

export type {
  AppContext
}

export const appContext = new AppContext();