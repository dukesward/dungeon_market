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
}

export type {
  AppContext
}

export const appContext = new AppContext();