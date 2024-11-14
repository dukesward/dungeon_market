import { Observable, tap } from "rxjs";
import apiServiceDelegator from "./components/ApiServiceDelegator";
import { ErrorMessageWrapper, ServiceCallError, SimpleMap, TenantIdResponse } from "./layouts/types";

const env = require('./env.json');
const env_configs = env['APP_ENV_CONFIGS'][env['APP_ENV']];

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
  TenantId: 'tenantId'
}

class AppContext {
  appConstants: SimpleMap<SimpleMap<string>> = {}
  errorMessages: ErrorMessageWrapper[] = []
  stateHooks: {[key: string]: (data: any) => void} = {}
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
  envVar(name: string): string {
    return env[name] || env_configs[name];
  }
  envConfigs(): any {
    return env_configs;
  }
  getWebCache(key: string): string | null {
    return localCache.getItem(CACHE_KEY[key]);
  }
  setWebCache(key: string, val: string): void {
    localCache.setItem(CACHE_KEY[key], val);
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
  getTenantId(): Observable<TenantIdResponse> {
    let tenantId: string = this.getWebCache(CACHE_KEY.TenantId) || '';
    if(tenantId) {
      return new Observable<TenantIdResponse>(observer => {
        observer.next({
          code: 0,
          data: parseInt(tenantId),
          msg:'success'
        });
        observer.complete();
      });
    }else {
      return apiServiceDelegator.getService(
        'tenant_id',
        {}
      ).pipe(
        tap((data: TenantIdResponse) => {
          this.setWebCache(CACHE_KEY.TenantId, data.data.toString());
        })
      );
    }
  }
}

export type {
  AppContext
}

export const appContext = new AppContext();