import apiServiceDelegator from "./components/ApiServiceDelegator";
import ErrorMessagePrinter from "./widgets/ErrorMessagePrinter";
import { ErrorHandler, ErrorMessageWrapper, SimpleMap } from "./layouts/types";

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
  errorHandler: ErrorHandler = new ErrorMessagePrinter();
  initialize(
    callback?: () => void,
    error?: ErrorMessageWrapper) {
    apiServiceDelegator.getService(
      'error_code_constants',
      { 'app_locale_id': appContext.envVar('APP_LOCALE_ID') }

    ).subscribe({
      next: (data: SimpleMap<string>) => {
        console.log(data);
        if(data) {
          // 初始化错误码
          this.appConstants['error_code'] = data;
        }
        callback && callback();
      },
      error: error => {
        console.log(error);
        if(error) {
          this.errorHandler.handle(error);
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
  getWebCache = (key: string) => {
    return localCache.getItem(CACHE_KEY[key]);
  }
  setWebCache = (key: string, val: string) => {
    localCache.setItem(CACHE_KEY[key], val);
  }
  getConstant = (type: string, key: string): string | null => {
    return this.appConstants[type] ? this.appConstants[type][key] : null;
  }
  getErrorHandler = () => {
    return this.errorHandler;
  }
}

export type {
  AppContext
}

export const appContext = new AppContext();