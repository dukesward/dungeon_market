import { TenantIdResponse } from "../../../src/layouts/types";
import { AppHttpServiceConsumer } from "../AppService";
import { appContext } from "../../../src/AppContext";

class TenantService extends AppHttpServiceConsumer<TenantIdResponse> {
  app_tenant_api: string
  constructor() {
    super();
    this.app_tenant_api = appContext.envVar("API_ADMIN_SYSTEM_BASE");
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
}

export default TenantService;