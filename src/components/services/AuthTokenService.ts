import { appContext } from "../../../src/AppContext";
import { AuthTokenEntity } from "../../../src/layouts/types";
import { AppHttpServiceConsumer } from "../AppService";

class AuthTokenService extends AppHttpServiceConsumer<AuthTokenEntity> {
  constructor() {
    super();
    this.api_app = appContext.envVar('API_APP_SYSTEM_BASE');
    this.services = {
      'validate_token': 'auth/token/validate'
    }
  }
  mapObject(data: any): AuthTokenEntity {
    return new AuthTokenEntity(data);
  }
  validate(data: any): boolean {
    return data && data.access_token && data.expires_in;
  }
  customHeaders(params: any): {} {
    return {
      'Tenant-Id': params.tenant_id || '0'
    };
  }
}

export default AuthTokenService;