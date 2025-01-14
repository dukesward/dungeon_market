import AppModel from "../AppModel";
import { HttpMethod } from "../AppService";

export class CustomerProfile implements AppModel {
  profile: any;
  constructor(data: any) {
    this.profile = data.profile;
  }
}

export const CustomerProfileServiceProvider = (
  function () {
    return {
      'customer_profile': {
        uri: 'customer/profile',
        method: HttpMethod.GET,
        mapper: (data: any) => {
          return new CustomerProfile(data);
        },
        validate: (data: any) => {
          return data && data.profile;
        },
        headers: {
          'tenant_id': '{tenant_id}'
        }
      }
    };
  }
)();
