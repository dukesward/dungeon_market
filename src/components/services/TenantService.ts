import { TenantIdResponse } from "../../../src/layouts/types";
import { HttpMethod } from "../AppService";

export const tenantServiceProvider = (function () {
  return {
    'tenant_id': {
      uri: 'tenant/get-id-by-name',
      method: HttpMethod.GET,
      mapper: (data: any) => {
        return data;
      },
      validate: (data: any) => {
        return data && data.code === 0;
      },
    }
  };
})();