import { Observable } from "rxjs";
import { HttpRequest } from "./AppService";
import { ApiDelegatorConfigurer, Dictionary } from "../layouts/types";
import { userPassLoginServiceProvider } from "./services/UserPassLoginService";
import { tenantServiceProvider } from "./services/TenantService";
import { constantServiceProvider } from "./services/ConstantService";
import AppModel from "./AppModel";
import { pageLayoutServiceProvider } from "./services/PageLayoutService";
import { authTokenServiceProvider } from "./services/AuthTokenService";

class ApiServiceDelegator {
  static delegator: ApiServiceDelegator
  services: {[service_id: string]: ApiDelegatorConfigurer<any, any>}
  private constructor() {
    this.services = {};
    this.registerService(constantServiceProvider);
    this.registerService(pageLayoutServiceProvider);
    this.registerService(userPassLoginServiceProvider);
    this.registerService(tenantServiceProvider);
    this.registerService(authTokenServiceProvider);
  }
  static getApiServiceDelegator(): ApiServiceDelegator {
    if(!this.delegator) this.delegator = new ApiServiceDelegator();
    return this.delegator;
  }
  getArbitraryService<T extends AppModel, P extends object>(
    id: string, factory?: () => ApiDelegatorConfigurer<T, P>): 
    ApiDelegatorConfigurer<T, P> {
    if(!this.services[id] && factory) {
      this.services[id] = factory();
    }
    return this.services[id];
  }
  getService(id: string, params: any): Observable<any> {
    return this.getArbitraryService(id).invoke(params);
  }
  registerService(
    services: Dictionary<HttpRequest<any, any>>): void {
    Object.keys(services).forEach(key => {
      this.services[key] = new ApiDelegatorConfigurer(services[key], key);
    });
  }
}

let apiServiceDelegator = ApiServiceDelegator.getApiServiceDelegator();

export default apiServiceDelegator;