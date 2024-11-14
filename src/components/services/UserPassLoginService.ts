import { UserPassLogin } from "../../../src/layouts/types";
import { AppHttpServiceConsumer } from "../AppService";
import { appContext } from "../../../src/AppContext";

class UserPassLoginService extends AppHttpServiceConsumer<UserPassLogin> {
  constructor() {
    super();
    this.api_app = appContext.envVar("API_APP_USER_BASE");
    this.services = {
      'user_pass_login': 'auth/simple/login'
    }
  }
  mapObject(data: any): UserPassLogin {
    return new UserPassLogin(data);
  }
  validate(data: any): boolean {
    return data && data.user && data.pass;
  }
  customHeaders(params: any): {} {
    return {
      'Tenant-Id': params.tenant_id || '0'
    };
  }

}

export default UserPassLoginService;