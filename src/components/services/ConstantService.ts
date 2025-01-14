import { SimpleMap } from "@/src/layouts/types";
import { HttpMethod } from "../AppService";

export const constantServiceProvider = (function () {
  return {
    'error_code_constants': {
      uri: 'static/constants/{app_locale_id}/errorCodes.json',
      method: HttpMethod.GET,
      mapper: (data: any) => {
        let map: SimpleMap<string> = {};
        Object.keys(data).forEach(key => {
          map[key] = '' + data[key];
        });
        return map;
      },
      validate: (data: any) => {
        return Object.keys(data).length > 0;
      },
    }
  };
})();