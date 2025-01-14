import { AuthTokenEntity } from "../../../src/layouts/types";
import { HttpMethod } from "../AppService";

export const authTokenServiceProvider = (function () {
  return {
    'validate_token': {
      uri: 'auth/token/validate',
      method: HttpMethod.POST,
      mapper: (data: any) => {
        return new AuthTokenEntity(data);
      },
      validate: (data: any) => {
        return data && data.access_token && data.expires_in;
      },
      headers: {
        'tenant_id': '{tenant_id}'
      }
    }
  };
})();
