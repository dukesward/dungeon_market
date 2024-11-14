import { TenantIdResponse } from "../../../src/layouts/types";
import { AppHttpServiceConsumer } from "../AppService";
import { appContext } from "../../../src/AppContext";

class TenantService extends AppHttpServiceConsumer<TenantIdResponse> {
  constructor() {
    super();
    this.services = {
      'tenant_id': 'tenant/get-id-by-name'
    }
  }
  mapObject(data: any): any {
    return data;
  }
  validate(data: any): boolean {
    return data && data.code === 0;
  }
  customParams(params: any) {
    params.name = params.name || '芋道源码';
    return params;
  }
  /*async getTenantIdByName(tenant_name: string): Promise<TenantIdResponse> {
    const url = `${this.app_tenant_api}/${this.services['tenant_id']}`;
    const params = {
      tenant_name: tenant_name
    }
    const res = await this.get(url, params);
    if (res && res.code === 0) {
      return res;
    }
    return null;
  }*/

}

export default TenantService;