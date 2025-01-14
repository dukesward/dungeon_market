import { UserPassLogin } from "../../../src/layouts/types";
import { HttpMethod } from "../AppService";


export const userPassLoginServiceProvider = (function () {
  return {
    'user_pass_login': {
      uri: 'auth/simple/login',
      method: HttpMethod.POST,
      mapper: (data: any) => {
        return new UserPassLogin(data);
      },
      validate: (data: any) => {
        return data && data.user && data.pass;
      },
      payload: {
        'email': '{email}',
        'password': '{password}'
      },
      headers: {
        'tenant_id': '{tenant_id}'
      }
    }
  };
})();