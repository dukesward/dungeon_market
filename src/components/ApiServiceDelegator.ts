import { Observable } from "rxjs";
import { HttpMethod } from "./AppService";
import PageLayoutService from "./services/PageLayoutService";
import { ApiDelegatorConfig, ApiDelegatorConfigurer } from "../layouts/types";
import UserPassLoginService from "./services/UserPassLoginService";
import TenantService from "./services/TenantService";

class ApiServiceDelegator {
  static delegator: ApiServiceDelegator
  services: {[service_id: string]: ApiDelegatorConfigurer}
  private constructor() {
    this.services = {};
    this.registerService('page_layout', new ApiDelegatorConfigurer({
      'service': new PageLayoutService(),
      'method': HttpMethod.GET,
      'serviceId': 'page_layout'
    }));
    this.registerService('user-pass-login', new ApiDelegatorConfigurer({
      'service': new UserPassLoginService(),
      'method': HttpMethod.POST,
      'serviceId': 'user-pass-login',
      //'uri': "auth/simple/login"
    }));
    this.registerService('tenant-id', new ApiDelegatorConfigurer({
      'service': new TenantService(),
      'method': HttpMethod.GET,
      'serviceId': 'tenant-id',
      //'uri': 'tenant/get-id-by-name',
      'params': {
        'name': '{tenant_name}'
      }
    }));
  }
  static getApiServiceDelegator(): ApiServiceDelegator {
    if(!this.delegator) this.delegator = new ApiServiceDelegator();
    return this.delegator;
  }
  getArbitraryService(id: string, factory?: () => ApiDelegatorConfigurer): 
    ApiDelegatorConfigurer {
    if(!this.services[id] && factory) {
      this.services[id] = factory();
    }
    return this.services[id];
  }
  getService(id: string, params: any): Observable<any> {
    return this.getArbitraryService(id).invoke(params);
  }
  registerService(id: string, service: ApiDelegatorConfigurer): void {
    this.services[id] = service;
  }
}

let apiServiceDelegator = ApiServiceDelegator.getApiServiceDelegator();

export default apiServiceDelegator;